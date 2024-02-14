import { Injectable } from "@nestjs/common";
import { CardsService } from "../cards/cards.service";
import { GeneralCard, AnkiNote, Set } from "@scholarsome/shared";
import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import AdmZip = require("adm-zip");
import { parse } from "csv-parse/sync";
import * as Database from "better-sqlite3";
import * as sharp from "sharp";
import { StorageService } from "../providers/storage/storage.service";

@Injectable()
export class ConvertingService {
  constructor(
    private readonly cardsService: CardsService,
    private readonly storageService: StorageService
  ) {}

  /**
   * Takes a set object and converts it to a string that can be imported into Quizlet
   *
   * @param set Set object
   * @param sideDiscriminator Character(s) to discriminate between sides of a card in the string
   * @param cardDiscriminator Character(s) to discriminate between cards in the string
   *
   * @returns Buffer of the .csv file
   */
  public convertSetToQuizletTxt(set: Set, sideDiscriminator: string, cardDiscriminator: string): Buffer | false {
    let txt = "";

    for (const card of set.cards) {
      if (
        card.term.includes(sideDiscriminator) ||
        card.term.includes(cardDiscriminator) ||
        card.definition.includes(sideDiscriminator) ||
        card.definition.includes(cardDiscriminator)
      ) return false;

      const term = card.term
          .replaceAll(/<img[^>]*>/g, "")
          .replaceAll(/<sound[^>]*>/g, "")
          .replaceAll("<p><br></p>", "\n")
          .replaceAll(/<[^>]+>|<[^>]+\/>/g, "");

      const definition = card.definition
          .replaceAll(/<img[^>]*>/g, "")
          .replaceAll(/<sound[^>]*>/g, "")
          .replaceAll("<p><br></p>", "\n")
          .replaceAll(/<[^>]+>|<[^>]+\/>/g, "");

      txt += term.trim() + sideDiscriminator.trim() + definition.trim() + cardDiscriminator.trim();
    }

    return Buffer.from(txt, "utf-8");
  }

  /**
   * Takes a set object and converts it to a .apkg file that can be opened in Anki
   *
   * @param set The Set object to encode to an Anki-compatible apkg
   *
   * @returns Buffer of the .apkg file
   */
  public async convertSetToApkg(set: Set): Promise<Buffer> {
    const db = new Database(":memory:");
    const apkg = new AdmZip();

    const apkgSql = fs.readFileSync(path.join(__dirname, "assets", "apkgExport", "createApkg.sql"), "utf-8");
    const colSql = fs.readFileSync(path.join(__dirname, "assets", "apkgExport", "col.sql"), "utf-8");

    const queries = apkgSql.split(";");

    for (const query of queries) {
      db.exec(query);
    }

    const colConf = {
      "addToCur": true,
      "collapseTime": 1200,
      "activeDecks": [1],
      "creationOffset": 240,
      "dayLearnFirst": false,
      "newSpread": 0,
      "sortType": "noteFld",
      "curModel": 1702145099915,
      "curDeck": 1,
      "estTimes": true,
      "timeLim": 0,
      "dueCounts": true,
      "sortBackwards": false,
      "nextPos": 1,
      "schedVer": 2
    };

    const modelAndColId = Date.now();

    const colModels = {
      [modelAndColId]: {
        "id": modelAndColId,
        "name": "Basic",
        "type": 0,
        "mod": 0,
        "usn": 0,
        "sortf": 0,
        "did": null,
        "tmpls": [{
          "name": "Card 1",
          "ord": 0,
          "qfmt": "{{Front}}",
          "afmt": "{{FrontSide}}\n\n<hr id=answer>\n\n{{Back}}",
          "bqfmt": "",
          "bafmt": "",
          "did": null,
          "bfont": "",
          "bsize": 0
        }],
        "flds": [{
          "name": "Front",
          "ord": 0,
          "sticky": false,
          "rtl": false,
          "font": "Arial",
          "size": 20,
          "description": "",
          "plainText": false,
          "collapsed": false,
          "excludeFromSearch": false
        }, {
          "name": "Back",
          "ord": 1,
          "sticky": false,
          "rtl": false,
          "font": "Arial",
          "size": 20,
          "description": "",
          "plainText": false,
          "collapsed": false,
          "excludeFromSearch": false
        }],
        "css": ".card {\n    font-family: arial;\n    font-size: 20px;\n    text-align: center;\n    color: black;\n    background-color: white;\n}\n",
        "latexPre": "\\documentclass[12pt]{article}\n\\special{papersize=3in,5in}\n\\usepackage[utf8]{inputenc}\n\\usepackage{amssymb,amsmath}\n\\pagestyle{empty}\n\\setlength{\\parindent}{0in}\n\\begin{document}\n",
        "latexPost": "\\end{document}",
        "latexsvg": false,
        "req": [
          [0, "any", [0]]
        ],
        "originalStockKind": 1
      }
    };

    const colDecks = {
      [modelAndColId]: {
        "id": modelAndColId,
        "mod": Math.round(Date.now() / 1000),
        "name": set.title,
        "usn": -1,
        "lrnToday": [0, 0],
        "revToday": [0, 0],
        "newToday": [0, 0],
        "timeToday": [0, 0],
        "collapsed": true,
        "browserCollapsed": true,
        "desc": "",
        "dyn": 0,
        "conf": 1,
        "extendNew": 0,
        "extendRev": 0,
        "reviewLimit": null,
        "newLimit": null,
        "reviewLimitToday": null,
        "newLimitToday": null
      },
      "1": {
        "id": 1,
        "mod": 0,
        "name": "Default",
        "usn": 0,
        "lrnToday": [0, 0],
        "revToday": [0, 0],
        "newToday": [0, 0],
        "timeToday": [0, 0],
        "collapsed": true,
        "browserCollapsed": true,
        "desc": "",
        "dyn": 0,
        "conf": 1,
        "extendNew": 0,
        "extendRev": 0,
        "reviewLimit": null,
        "newLimit": null,
        "reviewLimitToday": null,
        "newLimitToday": null
      }
    };

    const dConf = {
      "1": {
        "id": 1,
        "mod": 0,
        "name": "Default",
        "usn": 0,
        "maxTaken": 60,
        "autoplay": true,
        "timer": 0,
        "replayq": true,
        "new": {
          "bury": false,
          "delays": [1.0, 10.0],
          "initialFactor": 2500,
          "ints": [1, 4, 0],
          "order": 1,
          "perDay": 20
        },
        "rev": {
          "bury": false,
          "ease4": 1.3,
          "ivlFct": 1.0,
          "maxIvl": 36500,
          "perDay": 200,
          "hardFactor": 1.2
        },
        "lapse": {
          "delays": [10.0],
          "leechAction": 1,
          "leechFails": 8,
          "minInt": 1,
          "mult": 0.0
        },
        "dyn": false,
        "newMix": 0,
        "newPerDayMinimum": 0,
        "interdayLearningMix": 0,
        "reviewOrder": 0,
        "newSortOrder": 0,
        "newGatherPriority": 0,
        "buryInterdayLearning": false
      }
    };

    const colCreation = db.prepare(colSql);
    colCreation.run([
      Date.now(),
      Date.now(),
      Date.now(),
      JSON.stringify(colConf),
      JSON.stringify(colModels),
      JSON.stringify(colDecks),
      JSON.stringify(dConf),
      "{}"
    ]);

    const noteSql = fs.readFileSync(path.join(__dirname, "assets", "apkgExport", "notes.sql"), "utf-8");
    const noteCreation = db.prepare(noteSql);

    const cardSql = fs.readFileSync(path.join(__dirname, "assets", "apkgExport", "cards.sql"), "utf-8");
    const cardCreation = db.prepare(cardSql);

    const mediaJson: { [key: string]: string } = {};
    let mediaCounter = 0;

    for (let i = 0; i < set.cards.length; i++) {
      const noteId = Math.ceil(Math.random() * 1e13);

      const termMatches = set.cards[i].term.match(/<[^>]+src="([^">]+)"/g);
      const definitionMatches = set.cards[i].definition.match(/<[^>]+src="([^">]+)"/g);

      let sources = [];

      if (termMatches) sources = Object.values(termMatches);
      if (definitionMatches) sources = [...sources, ...Object.values(definitionMatches)];

      if (sources) {
        for (const match of sources) {
          const src = match.split("\"")[1];
          const fileName = src.split("/")[5];

          set.cards[i].term = set.cards[i].term.replaceAll(src, fileName);
          set.cards[i].definition = set.cards[i].definition.replaceAll(src, fileName);

          mediaJson[mediaCounter.toString()] = fileName;

          const file = await this.storageService.getInstance()
              .getFile("media/sets/" + set.id + "/" + fileName);

          apkg.addFile(mediaCounter.toString(), Buffer.from(file.content));
          mediaCounter++;
        }
      }

      noteCreation.run(
          noteId,
          crypto.randomBytes(5).toString("hex"),
          modelAndColId,
          Math.round(Date.now() / 1000),
          "",
          set.cards[i].term + "" + set.cards[i].definition,
          set.cards[i].term,
          crypto.createHash("sha1").update(set.cards[i].term).digest("hex").toString().substring(0, 9),
          ""
      );

      cardCreation.run(
          Math.ceil(Math.random() * 1e13),
          noteId,
          modelAndColId,
          Math.round(Date.now() / 1000),
          ""
      );
    }

    // convert db to buffer
    const serialized = db.serialize();

    db.close();

    apkg.addFile("collection.anki2", serialized);
    apkg.addFile("media", Buffer.from(JSON.stringify(mediaJson), "utf-8"));

    return apkg.toBuffer();
  }

  /**
   * Takes a set object and converts it to a .csv file
   *
   * @param set Set object
   *
   * @returns Buffer of the .csv file
   */
  public convertSetToCsv(set: Set): Buffer | false {
    let csv = "";

    for (const card of set.cards) {
      const term =
        "\"" +
        card.term
            .replaceAll(/<img[^>]*>/g, "")
            .replaceAll(/<sound[^>]*>/g, "")
            .replaceAll("<p><br></p>", "\n")
            .replaceAll("\"", "\"\"")
            .replaceAll(/<[^>]+>|<[^>]+\/>/g, "") +
        "\"";

      const definition =
        "\"" +
        card.definition
            .replaceAll(/<img[^>]*>/g, "")
            .replaceAll(/<sound[^>]*>/g, "")
            .replaceAll("<p><br></p>", "\n")
            .replaceAll("\"", "\"\"")
            .replaceAll(/<[^>]+>|<[^>]+\/>/g, "") +
        "\"";

      csv += term + "," + definition + "\n";
    }

    return Buffer.from(csv, "utf-8");
  }

  /**
   * Gets the media content of a set and packages it into a .zip file
   *
   * @param setId ID of the set to export the media from
   *
   * @returns Buffer of the .zip file
   *
   * @remarks False return means that something went wrong
   * @remarks Null return means that the set does not have any media within its cards
   */
  public async createZipOfSetMedia(setId: string): Promise<Buffer | false | null> {
    const zip = new AdmZip();

    const media = await this.cardsService.cardMedias({
      where: {
        card: {
          setId
        }
      }
    });
    if (!media) return false;
    if (media.length === 0) return null;

    const files = await this.storageService.getInstance()
        .getDirectoryFiles("media/sets/" + setId);

    files.map((file) => zip.addFile(
        file.fileName, Buffer.from(file.content)
    ));

    return zip.toBuffer();
  }

  /**
   * Converts a Quizlet export into cards that can be used in a Scholarsome set
   *
   * @param setString The string of text that contains the cards that was exported by Quizlet
   * @param sideDiscriminator Character(s) to discriminate between sides of a card in the string
   * @param cardDiscriminator Character(s) to discriminate between cards in the string
   *
   * @returns Array of cards generated from the string of text
   */
  public quizletStringToCards(setString: string, sideDiscriminator: string, cardDiscriminator: string): GeneralCard[] | false {
    const cardsRaw = setString
        // substring to get rid of last semicolon
        .substring(0, setString.length - 1).split(cardDiscriminator);

    if (cardsRaw.length < 1) return false;

    const cards: GeneralCard[] = [];

    for (let i = 0; i < cardsRaw.length; i++) {
      const split = cardsRaw[i].split(sideDiscriminator);

      cards.push({
        index: i,
        term: split[0].replace(/(\r\n|\r|\n)/g, "<p><br></p>"),
        definition: split[1].replace(/(\r\n|\r|\n)/g, "<p><br></p>")
      });
    }

    return cards;
  }

  /**
   * Converts the Buffer of a .apkg file to a JSON of the cards contained within
   * and uploads media to storage destination (local or S3)
   *
   * Only supports Basic note types in Anki
   *
   * @param file Buffer of the .apkg file
   * @param setId UUID to be used for the set ID
   *
   * @returns Array of cards generated from the file
   */
  public async apkgToCardsAndMedia(file: Buffer, setId: string): Promise<{ cards: GeneralCard[], media: string[] } | false> {
    const zip = new AdmZip(file);
    const dbFile = zip.readFile("collection.anki2");

    const db = new Database(dbFile);
    let notes: AnkiNote[] = db.prepare("SELECT * FROM Notes").all() as AnkiNote[];

    const cards: {
      term: string;
      definition: string;
      index: number;
    }[] = [];

    const media: string[] = [];

    if (
      notes[0].flds.split(/\x1F/)[0].includes("Please update to the latest Anki version")
    ) {
      notes = new Database(zip.readFile("collection.anki21")).prepare("SELECT * FROM Notes").all() as AnkiNote[];
    }

    for (const [i, note] of notes.entries()) {
      const split = note.flds.split(/\x1F/);

      if (split.length > 2) {
        return false;
      }

      // audio polyfill
      const termAudio = split[0].match(/\[sound:(.*?)\]/);
      if (termAudio) split[0] = split[0].replace(termAudio[0], `<audio controls><source src="${termAudio[1]}"></audio>`);

      const definitionAudio = split[1].match(/\[sound:(.*?)\]/);
      if (definitionAudio) split[1] = split[1].replace(definitionAudio[0], `<audio controls><source src="${definitionAudio[1]}"></audio>`);

      // font -> p tag polyfill
      split[0] = split[0].replaceAll("<font", "<span").replaceAll("</font>", "</span>");
      split[1] = split[1].replaceAll("<font", "<span").replaceAll("</font>", "</span>");

      cards.push({
        term: split[0],
        definition: split[1],
        index: i
      });
    }

    db.close();

    // by this point we already know all cards are compatible
    if (zip.readFile("media")) {
      let mediaLegend: string[][];

      try {
        mediaLegend = Object.entries(JSON.parse(zip.readFile("media").toString()));
      } catch (e) {
        mediaLegend = null;
      }

      if (mediaLegend) {
        for (const [i, card] of cards.entries()) {
          const termMatches = card.term.match(/<[^>]+src="([^">]+)"/g);
          const definitionMatches = card.definition.match(/<[^>]+src="([^">]+)"/g);

          let sources = [];

          if (termMatches) sources = Object.values(termMatches);
          if (definitionMatches) sources = [...sources, ...Object.values(definitionMatches)];

          // if there are any sources
          if (sources) {
            // extract src attribute from img tag
            sources = sources.map((x) => x.replace(/.*src="([^"]*)".*/, "$1"));

            for (const source of sources) {
              // find index in mediaLegend
              for (let x = 0; x < mediaLegend.length; x++) {
                if (mediaLegend[x][1] === source) {
                  // convert to jpeg and compress
                  let file = zip.readFile(mediaLegend[x][0]);
                  let extension = mediaLegend[x][1].split(".").pop();

                  if (
                    extension === "jpeg" ||
                    extension === "jpg" ||
                    extension === "png" ||
                    extension === "tiff" ||
                    extension === "webp"
                  ) {
                    file = await sharp(zip.readFile(mediaLegend[x][0])).jpeg({ progressive: true, force: true, quality: 80 }).toBuffer();
                    extension = ".jpeg";
                  } else {
                    extension = mediaLegend[x][1].split(".").pop();
                  }

                  // in the format of setId/fileName.jpeg
                  const name = crypto.randomUUID();
                  media.push(name + extension);

                  await this.storageService.getInstance()
                      .putFile("media/sets/" + setId + "/" + name + extension, file);

                  // replace src with new fileName
                  cards[i].term = cards[i].term.replace(mediaLegend[x][1], "/api/sets/" + setId + "/media/" + name + extension);
                  cards[i].definition = cards[i].definition.replace(mediaLegend[x][1], "/api/sets/" + setId + "/media/" + name + extension);

                  break;
                }
              }
            }
          }
        }
      }
    }

    return { cards, media };
  }

  /**
   * Takes a CSV file and converts it to an array of cards
   *
   * @param file CSV file
   *
   * @returns Array of the cards
   *
   * @remarks False indicates that the CSV failed to be parsed
   */
  csvToCards(file: Express.Multer.File): GeneralCard[] | false {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let parsed: Array<any>;

    try {
      // eslint-disable-next-line camelcase
      parsed = parse(file.buffer.toString().replace(/\r\n/g, "\n"), { skip_empty_lines: false });
    } catch (e) {
      return false;
    }

    const cards: GeneralCard[] = [];

    for (let i = 0; i < parsed.length; i++) {
      cards.push({
        term: parsed[i][0].replaceAll("\n", "<br>"),
        definition: parsed[i][1].replaceAll("\n", "<br>"),
        index: i
      });
    }

    return cards;
  }
}
