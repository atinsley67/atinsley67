import React from "react";
import { Container } from "../util/container";
import { Section } from "../util/section";
import { TinaMarkdown,  Components} from "tinacms/dist/rich-text";
import type { TinaTemplate } from "tinacms";

const components: Components<{
  img: React.ComponentType<{ url: string; alt: string; caption: string }>;
}> =  {
    img: (props) => (
      <div className="flex flex-col items-center justify-center">
        <img className="mb-3" src={props.url} alt={props.alt} />
        <div className="text-xs font-semibold text-gray-600">{props.caption}</div>
      </div>
    )
  }

export const Content = ({ data, parentField = "" }) => {
  return (
    <Section color={data.color}>
      <Container
        className={`prose prose-lg ${
          data.color === "primary" ? `prose-primary` : `dark:prose-dark`
        }`}
        data-tinafield={`${parentField}.body`}
        size="large"
        width="medium"
      >
        <TinaMarkdown components={components} content={data.body} />
      </Container>
    </Section>
  );
};

export const contentBlockSchema: TinaTemplate = {
  name: "content",
  label: "Content",
  ui: {
    defaultItem: {
      body: "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Donec odio. Quisque volutpat mattis eros. Nullam malesuada erat ut turpis. Suspendisse urna nibh, viverra non, semper suscipit, posuere a, pede.",
    },
  },
  fields: [
    {
      type: "rich-text",
      label: "Body",
      name: "body",
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      options: [
        { label: "Default", value: "default" },
        { label: "Tint", value: "tint" },
        { label: "Primary", value: "primary" },
      ],
    },
  ],
};
