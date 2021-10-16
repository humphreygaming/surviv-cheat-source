from __future__ import annotations

from enum import Enum
from functools import reduce
from typing import NamedTuple, Tuple

class Weapon(NamedTuple):
    name: str
    switch_delay: int
    deploy_group: int # do not use 0; also, use -1 and -2 for "no deploy group"
    mag_size: int
    fire_delay: int = 0

class ShotAction(Enum):
    FULL_DELAY = 0
    FREE_SWITCH = 1
    INITIAL_IMMEDIATE = 2
    INITIAL_FS = 3

class Shot(NamedTuple):
    action: ShotAction
    weap_index: int
    delay: int
    next_free_switch_state: int

ShotChain = Tuple[Shot, ...]
ShotChains = Tuple[ShotChain, ...]

ShotCount = Tuple[int, ...]

class SolverState(NamedTuple):
    shots: ShotCount
    deploy_group: int
    free_switch_state: int

class SolverSolution(NamedTuple):
    objective: int = 0
    count: int = 1
    chains: ShotChain = ((),)

    def merge(self, other: SolverSolution) -> SolverSolution:
        return SolverSolution(self.objective, self.count + other.count, self.chains + other.chains)

class Solver(NamedTuple):
    memo: dict
    weapons: Tuple[Weapon, ...]

    require_shot_at_zero: bool = False
    free_switch_timer: int = 1000
    free_switch_delay: int = 250
    max_slow: int = 0 # not supported
    initial_time_offset: int = 0

    @classmethod
    def new(cls, *args, **kwargs):
        return cls(memo={}, *args, **kwargs)

    def minimize_time_first_to_last(self) -> SolverSolution:
        s = self._get_shots_initial()
        if self.require_shot_at_zero:
            return self._solve_initial(s, 0, self.initial_time_offset, ShotAction.INITIAL_IMMEDIATE)
        else:
            return self._solve_initial(s, 1, self.free_switch_timer - 1 + self.initial_time_offset, ShotAction.INITIAL_FS)

    def minimize_max_time_between_shots(self) -> SolverSolution:
        raise NotImplementedError('this problem is hard')

    def _get_shots_initial(self) -> ShotCount:
        return tuple(w.mag_size for w in self.weapons)

    @staticmethod
    def _merge_solution_min(a: SolverSolution, b: SolverSolution) -> SolverSolution:
        if a.objective < b.objective:
            return a
        if b.objective < a.objective:
            return b
        return a.merge(b)

    def _solve(self, state: SolverState) -> SolverSolution:
        if not any(state.shots):
            return SolverSolution()

        if state not in self.memo:
            def next_state_generator():
                for i, weap in enumerate(self.weapons):
                    if state.shots[i]:
                        next_s = Solver.remove_one_shot(state.shots, i)

                        for delay, next_fs, action in (
                            # wait for next free switch
                            (
                                (state.free_switch_state
                                    if state.free_switch_state or weap.deploy_group != state.deploy_group
                                    else self.free_switch_timer)
                                    + self.free_switch_delay,
                                self.free_switch_timer - self.free_switch_delay,
                                ShotAction.FREE_SWITCH
                            ),
                            # use full switch delay
                            (
                                weap.switch_delay,
                                max(0, (state.free_switch_state or self.free_switch_timer) - weap.switch_delay),
                                ShotAction.FULL_DELAY
                            ),
                        ):
                            r, count, chains = self._solve(SolverState(next_s, weap.deploy_group, next_fs))
                            yield SolverSolution(
                                r + delay,
                                count,
                                tuple((Shot(action, i, delay, next_fs),) + x for x in chains)
                            )
            self.memo[state] = reduce(Solver._merge_solution_min, next_state_generator())

        return self.memo[state]

    def _solve_initial(self, shots: ShotCount, initial_fs: int, initial_delay: int, initial_action: ShotAction) -> SolverSolution:
        if not any(shots):
            return SolverSolution()

        # TODO refactor (looks very similar to _solve.next_state_generator)
        def next_state_generator():
            for i, weap in enumerate(self.weapons):
                if shots[i]:
                    r, count, chains = self._solve(SolverState(Solver.remove_one_shot(shots, i), weap.deploy_group, initial_fs))
                    yield SolverSolution(
                        r,
                        count,
                        tuple((Shot(initial_action, i, initial_delay, initial_fs),) + x for x in chains)
                    )

        return reduce(Solver._merge_solution_min, next_state_generator())

    @staticmethod
    def remove_one_shot(s: ShotCount, i: int) -> ShotCount:
        return s[:i] + (s[i] - 1,) + s[i + 1:]

class Formatter(NamedTuple):
    solver: Solver

    def format(self, chain: ShotChain) -> str:
        raise NotImplementedError

class TimingFormatter(Formatter):
    def format(self, chain: ShotChain) -> str:
        def generate_tokens():
            free_switch_token = 'fs {}'.format(self.solver.free_switch_delay)

            for shot in chain:
                if shot.action == ShotAction.FREE_SWITCH:
                    if shot.delay != self.solver.free_switch_delay:
                        yield str(shot.delay - self.solver.free_switch_delay)
                    yield free_switch_token
                elif shot.action != ShotAction.INITIAL_IMMEDIATE:
                    yield str(shot.delay)
                yield self.solver.weapons[shot.weap_index].name

        return ' '.join(generate_tokens())

class InstructionFormatter(Formatter):
    def format(self, chain: ShotChain) -> str:
        def generate_tokens():
            t = 0
            last_weap = -1
            for shot in chain:
                t += shot.delay

                if shot.action == ShotAction.INITIAL_FS or shot.action == ShotAction.FREE_SWITCH:
                    if shot.delay != self.solver.free_switch_delay and shot.action == ShotAction.FREE_SWITCH:
                        yield 'c'
                        yield str(t - self.solver.free_switch_delay) + ':'
                    yield chr(ord('A') + shot.weap_index)
                else:
                    if last_weap == shot.weap_index:
                        yield 'd'
                    yield chr(ord('a') + shot.weap_index)

                if t:
                    yield str(t) + ':'

                yield '!'
                last_weap = shot.weap_index
        return ' '.join(generate_tokens())

def main():
    solver = Solver.new(
        weapons=(
            Weapon('MP', 300, 1, 2),
            Weapon('M8', 900, -2, 5),
        ),
        require_shot_at_zero=False,
        initial_time_offset=-299,
    )

    formatters = (TimingFormatter(solver), InstructionFormatter(solver))

    best, best_count, best_chains = solver.minimize_time_first_to_last()
    print(best_count)
    print(best)
    for chain in best_chains:
        print()
        for formatter in formatters:
            print(formatter.format(chain))

if __name__ == '__main__':
    main()
