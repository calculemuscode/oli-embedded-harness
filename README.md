Note: this README is best to read at [oli-hammock.surge.sh](http://oli-hammock.surge.sh/)

The oli-hammock package is designed for [OLI](https://oli.cmu.edu/) developers that want to make simple
[embedded activities](https://github.com/CMUOLI/OLI/wiki/Creating-an-Embedded-Activity). Assignments made with
OLI Hammock are significantly less configurable than activities built directly against the OLI Superactivity;
the tradeoff is that there is less code required to create and grade activities.

You wrap your simple {@link Activity} specification up in the OLI Hammock,
and you hang the hammock into the OLI embedded activity framework. OLI runs the activity+hammock combination,
which gets smushed together with the help of Webpack into something that might as well be a regular old
embedded activity, as far as OLI Superactivity is concerned.

```
               ------------------- Your activity, resting in hammock
               |
               v          |------- The OLI Hammock
              o           v
\uuuu        /|\       uuuu/   |-- The OLI Superactivity & OLI APIs
 \ uuuuu     / \    uuuuu /    |
  \    uuuuuuuuuuuuuu    /     |
   \                    / <----|
   ----------------------
```

[![npm version](https://badge.fury.io/js/%40calculemus%2Foli-hammock.svg)](https://badge.fury.io/js/%40calculemus%2Foli-hammock)
[![Build Status](https://travis-ci.org/calculemuscode/oli-hammock.svg?branch=master)](https://travis-ci.org/calculemuscode/oli-hammock)
[![dependencies Status](https://david-dm.org/calculemuscode/oli-hammock/status.svg)](https://david-dm.org/calculemuscode/oli-hammock)
[![devDependencies Status](https://david-dm.org/calculemuscode/oli-hammock/dev-status.svg)](https://david-dm.org/calculemuscode/oli-hammock?type=dev)

Quick Start
===========

You can create and start a hammock project by running the following commands, replacing `my_project` with any name you want for your project. The `create-oli-hammock` script will ask you a number of questions, but it is okay to accept all the default answers by pressing the Enter key.

```
npx create-oli-hammock my_project
cd my_project
npm install
npm run watch
```

This starts a test version of a project where you can view it [on your local computer](http://localhost:8080/).

Pieces of a Project
===================

The default `create-oli-hammock` project contains several files that you won't need to edit:

 * `main.ts` - this is just an entry point into the code you will write
 * `main.xml` - this is used by the Hammock and by OLI to find the pieces of your activity
 * `node_modules` - this directory is automatically created and managed by NPM
 * `package-lock.json` - this file is automatically managed by NPM
 * `tsconfig.json` - this file tells Typescript how the project is built
 * `webpack.config.json` - this tells Hammock how to run your file locally, and how to build it for OLI

You probably won't need to muck about with `package.json` either, at least at first.

The files you want to immediately look at are these three:

 * `activity.ts`
 * `assets/webcontent/my_project/layout.html` (but with `my_project` replaced by the name you gave to `create-oli-hammock`)
 * `assets/webcontent/my_project/questions.json` (but with `my_project` replaced by the name you gave to `create-oli-hammock`)

Let's look at those three files:

activity.ts
-----------

The `activity.ts` creates a single {@link Activity} object. The documentation for {@link Activity}, especially the documentation 
for its three methods {@link Activity.init `init()`}, {@link Activity.parse `parse()`}, {@link Activity.read `read()`}, and {@link Activity.render `render()`}, are where you should start when trying
to understand Hammock.

The {@link Activity.read `read()`} function reads the DOM to capture all student response data into a
serializable object (in this case, an array with two elements). The hammock doesn't care what type of data
this is, as long as `JSON.parse(JSON.stringify(data))` is structurally the same as `data`.

The {@link Activity.init `init()`} function defines an initial object representing the state of a page with no
response data. This is called when the assignment is newly-initialized or newly-reset.

The {@link Activity.render `render()`} function changes the contents defined in the `layout` asset file based
on the {@link QuestionSpec} it is given. It should be the only function that manipulates the DOM, and it has
to be careful what changes it makes to the layout. This funciton must _always_ produce the same display given
the same information, regardless of what sequence of `render` calls have happened earlier.

The {@link Activity.parse `parse()`} function converts the object representating the state of the page into an
array of strings, which will be used as the keys for grading. These keys are used later in `questions.json`.

layout.html
-----------

The `layout.html` file defines a template for receiving student input and displaying hints and feedback. It
does not include the SUBMIT and RESET buttons; those get added automatically by Hammock.

questions.json
--------------

The `questions.json` asset defines how many parts a question has (this must agree with the activity spec's
`read` function). This file includes most of the grading logic, and needs to match up to the `parse` function
defined in the {@link Activity}.

The `questions.json` file should contain data that matches the description of a {@link QuestionSpec}.

OLI Hammock Commands
====================

`npm run watch` starts your activity running locally, at http://localhost:8080.

`npm run dist` starts your activity running on the internet where you can share it, using the free functionality of [surge.sh](https://surge.sh/). If this doesn't work (for instance, because your project name is taken already), you may need to edit the URL that surge will try to publish to in `package.json`. (The address still needs to be a surge.sh address, like somethingorother.surge.sh).

`npm run deploy` only works if you provided an OLI project repository root when you first ran `create-oli-hammock`. If you did this, then this will deploy your activity into that OLI project repository.

Custom path
===========

One of the questions that `create-oli-hammock` asks is what the "custom path within the OLI content directory" should be. If your OLI project is organized like this:

```
- project root directory
  |- build.xml
  |- content
  |  |- package.xml
  |  |- webcontent
  |  |- x-oli-workbook-page
  |- organizations
  |- tools
```

then the "extra path" should be the default, none.

If your OLI project is organized like this:

```
- project root directory
  |- build.xml
  |- content
  |  |- package.xml
  |  |- Part1
  |  |  |- package.xml
  |  |  |- webcontent
  |  |  |- x-oli-workbook-page
  |  |- Part2
  |  |  |- package.xml
  |  |  |- webcontent
  |  |  |- x-oli-workbook-page
  |  |- Part3
  |- organizations
  |- tools
``````

then the "extra path" should be "Part1" or "Part2", depending on which subdirectory you want the embedded activity to be associated with.

Preparing your OLI course
=========================

To modify your OLI project to handle OLI Hammock activities, you need to make three small changes:

The project's `build.xml` file needs to have the following added inside of its `<patternset id="web.content.files">` element:

```
<include name="**/webcontent/**/*.json" />
```

The same `build.xml` file should also have the following added to the `<patternset id="resource.files">`

```
<include name="**/x-oli-embed-activity-highstakes/**/*.xml" />
```

The final change is in `tools/oli/oli-content-tools.conf`. You should search for the `resource_type` element with the id `"x-oli-embed-activity"`, duplicate it, and change the id in the duplicate to `"x-oli-embed-activity-highstakes"`.

```
<!-- Embed Activity -->
<resource_type id="x-oli-embed-activity" display_name="Embed Activity">
  <capabilities standalone="false" inline="true"/>
  <resource_builder>
    <class>edu.cmu.oli.content.tools.builder.plugins.SuperActivityResourceBuilder</class>
  </resource_builder>
</resource_type>

<!-- Embed Activity -->
<resource_type id="x-oli-embed-activity-highstakes" display_name="Embed Activity (With Gradebook)">
  <capabilities standalone="false" inline="true"/>
  <resource_builder>
    <class>edu.cmu.oli.content.tools.builder.plugins.SuperActivityResourceBuilder</class>
  </resource_builder>
</resource_type>
```

This is a different use of the term "highstakes" than you see elsewhere in the OLI system. It just makes the OLI Hammock activities visible to the gradebook in the same way that all low-stakes inline activities are. (Without this change, OLI Hammock activities, and indeed all embedded activities, are completely invisible to the gradebook.)