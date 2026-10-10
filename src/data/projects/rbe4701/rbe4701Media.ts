import type { MediaItem } from "../../../components/mediaGallery";

export const rbe4701Media: MediaItem[] = [
    {
        src: "assets/projects/rbe4701/QLearningVariant5.mp4",
        title: "Q-Learning Agent: Two Monsters (Variant 5)",
        caption: "The trained approximate Q-learning agent bombs through rows of walls to reach the exit while avoiding a random monster and an aggressive monster. The debug panel shows the active FSM state, the Q-value of every action, and each feature's contribution to the chosen action."
    },
    {
        src: "assets/projects/rbe4701/QLearningVariant4.mp4",
        title: "Q-Learning Agent: Aggressive Monster (Variant 4)",
        caption: "The hardest scenario: an aggressive monster chases the agent within two cells while it still has to breach several walls. The agent switches between NAVIGATE, BREACH, WAIT_BLAST, and ESCAPE_BLAST weights as the situation changes."
    },
    {
        src: "assets/projects/rbe4701/QLearningVariant3.mp4",
        title: "Q-Learning Agent: Self-Preserving Monster (Variant 3)",
        caption: "The agent times its bombs and escapes so it stays out of the blast cross and away from the monster's attack range."
    },
    {
        src: "assets/projects/rbe4701/QLearningVariant1.mp4",
        title: "Q-Learning Agent: Alone in the World (Variant 1)",
        caption: "With no monsters, a pruned model with only four features clears a path through the walls and escapes in about 71 steps on average, with a 100% escape rate over 291,072 games."
    },
    {
        src: "assets/projects/rbe4701/ValueIterationVariant5.mp4",
        title: "Value Iteration Agent: Two Monsters (Project 1, Variant 5)",
        caption: "The Project 1 agent follows A* toward the exit and switches to a precomputed value-iteration policy whenever a monster comes within seven tiles."
    },
    {
        src: "assets/projects/rbe4701/ValueIterationVariant4.mp4",
        title: "Value Iteration Agent: Aggressive Monster (Project 1, Variant 4)",
        caption: "The MDP policy steps around an aggressive monster using a conservative chase model of where it will move next."
    }
];
