import { Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class HtmlDecodePipe implements PipeTransform {
  // converts &amp; &lt; &gt; to & < >
  // needed for routes that get their values directly from html fields

  transform(value: Record<string, unknown>): Record<string, unknown> {
    for (const property in value) {
      if (typeof value[property] === "string") {
        value[property] = (value[property] as string)
            .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
      }
    }

    return value;
  }
}
