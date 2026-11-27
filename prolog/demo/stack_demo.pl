% ENGRAM - Kaneo Task 1.04: Python -> SWI-Prolog bridge demonstration.
%
% Fictional facts about ENGRAM's own technology stack. This file is only a
% connectivity demo. It is NOT the ENGRAM access-control rule set.

% language(Language, Paradigm): Language is used for Paradigm in ENGRAM.
language(python, object_oriented).
language(python, functional).
language(python, scripting).
language(prolog, logic).
language(apl, language_design).

% uses_paradigm(?Language, ?Paradigm)
uses_paradigm(Language, Paradigm) :-
    language(Language, Paradigm).

% check(+Goal): print the result and exit with status 0 (proved) or 1 (not proved).
check(Goal) :-
    (   catch(call(Goal), Error, (print_message(error, Error), fail))
    ->  format("TRUE: ~q~n", [Goal]),
        halt(0)
    ;   format("FALSE: ~q~n", [Goal]),
        halt(1)
    ).

% main: the default demonstration goal.
main :-
    check(uses_paradigm(prolog, logic)).
