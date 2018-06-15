/**
 * The core of the OLI hammock's data model is the QuestionSpec.
 * 
 * This interface describes the **flexible input** that OLI hammock reads from a JSON file. This data is 
 * automatically converted into the much more rigid {@link QuestionData QuestionData} format.
 */
export interface QuestionSpec {
    /**
     * Prompts can optionally be associated with a question.
     */
    prompt?: string;

    /**
     * A question is made up of either one {@link PartSpec Part} or several {@link PartSpec Parts}. _Exactly
     * one_ of `parts` and `part` fields _must_ be present.
     */
    part?: PartSpec;

    /**
     * A question is made up of either one {@link PartSpec Part} or several {@link PartSpec Parts}. _Exactly
     * one_ of `parts` and `part` fields _must_ be present.
     */
    parts?: PartSpec[];

    /**
     * Hints may be associated with a complete question.
     */
    hints?: string[];
}

/**
 * A {@link QuestionSpec Question} is made up of parts. 
 * 
 * This interface describes the **flexible input** that OLI hammock reads from a JSON file. This data is 
 * automatically converted into the much more rigid {@link PartData PartData} format.
 */
export interface PartSpec {
    /**
     * Prompts can optionally be associated with a single part of a {@link QuestionSpec Question}.
     */
    prompt?: string;

    /**
     * Part score. Defaults to 1 if omitted.
     */
    score?: number;

    /**
     * The grading logic for the question is a map from keys to feedback.
     */
    match: { [key: string]: FeedbackSpec };

    /**
     * If the match logic is potentially incomplete, there *must* be a fallthrough `nomatch` case.
     */
    nomatch?: FeedbackSpec;

    /**
     * Hints may be associated with a part.
     */
    hints?: string[];
}

/**
 * The full specification of piece of feedback is a number (the score) and a string.
 *
 * Boolean values are shorthand: `[false, str]` gives no points, and `[true, str]` gives full points.
 *
 * Only specifying a string `str` is the same as `[0, s]`.
 * 
 * The strings you give will be interpreted as Mustache templates. See the {@link parse} function for details.
 * 
 * This interface describes the **flexible input** that OLI hammock reads from a JSON file. This data is 
 * automatically converted into the much more rigid {@link FeedbackData FeedbackData} format.
 */
export type FeedbackSpec = string | [boolean, string] | [number, string];
