---
sidebar_position: 2
---

# Creating Sets

Sets are the core foundation of Scholarsome. Flashcards, quizzes, and everything else are all built on top of the data stored within sets.

## Creating manually

The most common way to create a set is manually, where each card is typed in.

To create a set manually, click the purple button in the navigation bar that says "Create", and then click "Study set." This will take you to the set creation page.

In this menu, you can configure the set's title, description, visibility, and add cards. Your progress will be saved in your browser while creating a set - even if you close the tab, close your browser, or even restart your device. Click the purple "Create" button on the page once you are finished configuring the set. After creating a set, all parts of it can still be edited.

## Importing from Anki

Most sets from Anki can be imported to Scholarsome, via a `.apkg` file. At the moment, only notes with a traditional front and back are supported. Multiple fields will be supported in a future release.  If you receive an error that your set isn't supported, then it means that your set cannot be imported currently.

You will need to export your `.apkg` file before being able to import it to Scholarsome. Within Anki, click "File", then click "Export." Change the export format to "Anki Deck Package", and select the set you want to export in the "Include" section. 

To import a set from Anki, click the purple button in the navigation bar that says "Create", and then click "From Anki."

In this menu, you can configure the set's title, description, and visibility. Below the visibility toggle, you can upload your recently exported `.apkg` file.

Click the purple "Create" button once you are ready to import the set.

## Importing from Quizlet

Sets from Quizlet can only be imported if you are the one who created them. Quizlet only provides the exporting tools for the creator of the set.

To export a set from Quizlet, navigate to your set within Quizlet, and click the three dots next to the edit pencil, near your profile picture. Click "Export." 

When exporting a set from Quizlet, the set content is provided in a long paragraph of text that is formatted in a specific way that informs Scholarsome how to properly import your set. The way this is accomplished is by selecting characters that do not appear anywhere within your set to denote where in the long block of text flashcards start and end, and where sides of a card start and end.

When in the export page on Quizlet, you'll notice two sections, one being called "Between term and definition," and the other called "Between rows." This is where you inform Quizlet what characters to use to break up your list of flashcards in a way Scholarsome can understand. Our recommendation is to use a backwards slash (\\) for your "Between term and definition," and an asterisk (*) for your "Between rows," as these are characters likely not present in a set. However, the characters you use **does not matter** - it can be anything. All that matters is that the characters you choose do not appear anywhere in your set, otherwise it will not be able to be imported correctly. Click the "Copy text" button once you have configured these values correctly.

Back in Scholarsome, click the purple button in the navigation bar that says "Create", and then click "From Quizlet." In this menu, you can configure the set's title, description, and visibility. However, most important is that you use the same values in the "term and definition discriminator" and "row discriminator" input fields as you used in Quizlet. Ensure that you do not mix the two up, as the set will not import correctly. Below the visibility toggle, paste your copied set into the space below.

Click the purple "Create" button once you are ready to import the set.
