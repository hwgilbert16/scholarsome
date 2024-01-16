---
sidebar_position: 3
---

# Importing Sets

Scholarsome supports importing sets from three different locations: from Anki, from Quizlet, and from CSV files.

:::caution
Due to the limitations of other platforms, media content (images, sound, etc) can **only be imported from .apkg files.** When importing from Quizlet and CSV files, only text will be transferred.
:::

## Importing from Anki

:::caution
At the moment, only Anki sets that contain notes with a traditional front and back (i.e., two fields per note) are able to be imported. Multiple fields will be supported in a future release. 

If you receive an error when importing that your set isn't supported, then it means that your set cannot be imported currently.
:::

To import from Anki into Scholarsome, you will need to export a `.apkg` file of your Anki deck. Within Anki, click "File" in the top left corner, then click "Export." Change the export format to "Anki Deck Package", and select the set you want to export in the "Include" section.

:::danger
Ensure that the "Support older Anki versions" box is ticked, along with the "Include media" box if you would like to import the deck media into Scholarsome.
:::

![](/img/anki-export.png)

Click the "Export" button, and save the `.apkg` file to a convenient location.

To import the `.apkg` into Scholarsome, click the purple button in the navigation bar that says "Create", and then click "From Anki." A menu will open.

In this menu, you can configure the set's title, description, and visibility. At the bottom, click "Choose File," and then select your recently downloaded `.apkg` file to upload it.

Click the purple "Create" button once you are ready to import the set. You will be redirected to your new set once it is created. If the window closes and you aren't redirected, go to the homepage to find the new set.

## Importing from Quizlet

:::caution
Sets from Quizlet can only be imported if you are the one who created them. Quizlet only provides the exporting tools for the creator of the set.
:::

To export a set from Quizlet, navigate to your set within Quizlet, and click the three dots next to the edit pencil, near your profile picture. Click "Export."

![](/img/quizlet-import-1.png)

When exporting a set from Quizlet, the set content is provided in a long paragraph of text that is formatted in a specific way that informs Scholarsome how to correctly import your set. The way this is accomplished is by selecting characters that do not appear anywhere within your set to denote where in the block of text flashcards start and end, and where sides of a card start and end.

When in the export page on Quizlet, you'll find two text inputs, one being called "Between term and definition," and the other called "Between rows." This is where you inform Quizlet what characters to use to break up your list of flashcards in a way Scholarsome can understand. Click the "Copy text" button once you have configured these values correctly.

:::info
Our recommendation is to use a backwards slash (\\) for your "Between term and definition," and an asterisk (*) for your "Between rows," as these are characters likely not present in a set. However, the characters you use **does not matter** - it can be anything. All that matters is that the characters you choose **do not appear anywhere in your set,** otherwise your set will not import correctly.
:::

Back in Scholarsome, click the purple button in the navigation bar that says "Create", and then click "From Quizlet." 

In this menu, you can configure the set's title, description, and visibility. Additionally, you will need to input the same values in the "term and definition discriminator" and "row discriminator" input fields as you used in Quizlet. Ensure that you do not mix the two up, as the set will not import correctly. At the bottom of the menu, paste your copied set into text box that says "Paste in your exported set here..."

Click the purple "Create" button once you are ready to import the set.

## Importing from a CSV file

To import a set from a `.csv` file, you will need to have a `.csv` file that has two columns. The left column should contain the "terms" of your set, and the right column should contain the "definitions" of your set.

Click the purple button in the Scholarsome navigation bar that says "Create", and then click "From CSV." A menu will open.

In this menu, you can configure the set's title, description, and visibility. At the bottom, click "Choose File," and then select your `.csv` file to upload it.

Click the purple "Create" button once you are ready to import the set. You will be redirected to your new set once it is created. If the window closes and you aren't redirected, go to the homepage to find the new set.
