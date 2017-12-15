import { SuperActivity, SuperActivityClient } from "./superactivity";
import { Activity, QuestionData, PartData, FeedbackData } from "./activity";
import { readAssets } from "./assets";
import { QuestionInt, QuestionsInt, PartInt, validateQuestions } from "./int";
import { Runner } from "./runner";

/**
 * Attach boilerplate elements to the page
 */
function initializeHTML(assets: Map<string, Element>): void {
    // Always attach bootstrap to page (kind of ugly)
    $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css"
    }).appendTo("head");

    // Attach layout assets to page
    const layout = assets.get("layout");
    if (layout) $("#oli-embed").append(layout);
}

export function hammock<UserData>(activity: Activity<UserData>): SuperActivityClient {
    return {
        init: (superActivity: SuperActivity, activityData: Element): void => {
            readAssets(superActivity.webContentFolder, activityData).then(assets => {
                initializeHTML(assets);
                const questions = validateQuestions(assets.get("questions"));
                const runner = new Runner<UserData>(activity, superActivity, activityData, questions);
                runner.readSavedData().then(() => {

                    $("#oli-embed").append($("<button/>", {
                        class: "btn btn-primary btn-sm",
                        text: "SUBMIT",
                        click: () => runner.submit()
                    }));

                    $("#oli-embed").append($("<button/>", {
                        class: "btn btn-primary btn-sm",
                        text: "RESET",
                        click: () => runner.reset()
                    }));

                    runner.render();

                });
            });
        }
    };
}
