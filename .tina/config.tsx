import { defineConfig } from "tinacms";
import { contentBlockSchema } from "../components/blocks/content";
import { featureBlockSchema } from "../components/blocks/features";
import { featuredPostsBlockSchema} from "../components/blocks/featuredPosts";
import { heroBlockSchema } from "../components/blocks/hero";
import { testimonialBlockSchema } from "../components/blocks/testimonial";
import { ColorPickerInput } from "../components/fields/color";

const config = defineConfig({
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID!,
  branch:
    process.env.NEXT_PUBLIC_TINA_BRANCH! || // custom branch env override
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF! || // Vercel branch env
    process.env.HEAD!, // Netlify branch env
  token: process.env.TINA_TOKEN!,
  media: {
    // this is the config for the tina cloud media store
    //tina: {
    //  publicFolder: "public",
    //  mediaRoot: "uploads",
    //},
    // If you wanted cloudinary do this
    loadCustomStore: async () => {
      const pack = await import("next-tinacms-cloudinary");
      return pack.TinaCloudCloudinaryMediaStore;
    },
  },
  build: {
    publicFolder: "public", // The public asset folder for your framework
    outputFolder: "admin", // within the public folder
  },
  schema: {
    collections: [
      {
        label: "Blog Posts",
        name: "post",
        path: "content/posts",
        format: "mdx",
        fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            label: "Description",
            name: "description",
          },
          {
            type: "string",
            name: "categories",
            label: "Categories",
            list: true,
          },
          {
            type: "image",
            name: "heroImg",
            label: "Hero Image",
          },
          {
            type: "rich-text",
            label: "Excerpt",
            name: "excerpt",
          },
          {
            type: "reference",
            label: "Author",
            name: "author",
            collections: ["author"],
          },
          {
            type: "datetime",
            label: "Posted Date",
            name: "date",
            ui: {
              dateFormat: "MMMM DD YYYY",
              timeFormat: "hh:mm A",
            },
          },
          {
            type: "rich-text",
            label: "Body",
            name: "_body",
            templates: [
              {
                name: "DateTime",
                label: "Date & Time",
                inline: true,
                fields: [
                  {
                    name: "format",
                    label: "Format",
                    type: "string",
                    options: ["utc", "iso", "local"],
                  },
                ],
              },
              {
                name: "BlockQuote",
                label: "Block Quote",
                fields: [
                  {
                    name: "children",
                    label: "Quote",
                    type: "rich-text",
                  },
                  {
                    name: "authorName",
                    label: "Author",
                    type: "string",
                  },
                ],
              },
              {
                name: "NewsletterSignup",
                label: "Newsletter Sign Up",
                fields: [
                  {
                    name: "children",
                    label: "CTA",
                    type: "rich-text",
                  },
                  {
                    name: "placeholder",
                    label: "Placeholder",
                    type: "string",
                  },
                  {
                    name: "buttonText",
                    label: "Button Text",
                    type: "string",
                  },
                  {
                    name: "disclaimer",
                    label: "Disclaimer",
                    type: "rich-text",
                  },
                ],
                ui: {
                  defaultItem: {
                    placeholder: "Enter your email",
                    buttonText: "Notify Me",
                  },
                },
              },
              {
                name: "AffiliateLink",
                label: "Affiliate Link",
                fields: [
                  {
                    name: "altText",
                    label: "Alt Text",
                    type: "string",
                  },
                  {
                    name: "affiliateSnippet",
                    label: "Affiliate Snippet",
                    type: "string",
                  },
                  {
                    name: "imageURL",
                    label: "Affiliate Image URL",
                    type: "string",
                  },
                  {
                    name: "linkURL",
                    label: "Affiliate Link URL",
                    type: "string",
                  },
                  {
                    name: "image",
                    label: "Image",
                    type: "image",
                  },
                  {
                    label: "Button",
                    name: "button",
                    type: "boolean",
                  },
                  {
                    label: "Float Left",
                    name: "floatLeft",
                    type: "boolean",
                  },
                ],
              },
              {
                name: "TableOfContents",
                label: "Table Of Contents",
                fields: [
                  {
                    name: "title",
                    label: "Title",
                    type: "string",
                  },
                  {
                    name: "hLevel",
                    label: "Heading Level",
                    type: "string",
                  },
                ],
                ui: {
                  defaultItem: {
                      title: "In this Article:",
                      hLevel: "H1",
                  },
                },
              },
              {
                name: "Table",
                label: "Table",
                fields: [
                  {
                    name: "headers",
                    label: "Column Headers",
                    type: "string",
                    list: true,
                  },
                  {
                    name: "rows",
                    label: "Rows",
                    type: "object",
                    list: true,
                    fields: [
                      {
                        name: "cells",
                        label: "Cells",
                        type: "object",
                        list: true,
                        fields: [
                          {
                            name: "content",
                            label: "Content",
                            type: "string",
                            ui: {
                              component: "textarea",
                            }
                          },
                          {
                            name: "affiliateSnippet",
                            label: "Affiliate Snippet",
                            type: "object",
                            fields: [
                              {
                                name: "linkURL",
                                type: "string",
                              },
                              {
                                name: "imageURL",
                                type: "string",
                              }
                            ],
                            ui: {
                              parse: (val) => {
                                // Extract image URL
                                const imageMatch = val.match(/<img.*?src="(.*?)"/)
                                const imageSnippet = imageMatch ? imageMatch[1].replace(/&amp;/g, '&') : null;
                                // Extract link URL
                                const linkMatch = val.match(/<a.*?href="(.*?)"/)
                                const linkSnippet = linkMatch ? linkMatch[1].replace(/&amp;/g, '&') : null;
                                return (
                                  {"linkURL": linkSnippet,
                                  "imageURL": imageSnippet}
                                );
                              },
                              component: ({ field, input, meta }) => {
                                return (
                                  <div>
                                    <label className="block font-sans text-xs font-semibold text-gray-700 whitespace-normal mb-2 undefined">
                                      {field.label}
                                    </label>
                                    <input
                                      name="Snippet"
                                      id="snippet"
                                      type="string"
                                      // This will pass along props.input.onChange to set our form values as this input changes.
                                      onChange={input.onChange}
                                    />
                                    <p>{input.value.linkURL}</p>
                                    <p>{input.value.imageURL}</p>
                                  </div>
                                );
                              }
                            }
                          },
                        ],
                      }
                    ]
                  },
                ],
                ui: {
                  defaultItem: {
                    headers: [
                      "Product",
                      "Category",
                      "Features",
                    ],
                    rows: []
                  },
                }
              },
            ],
            isBody: true,
          },
        ],
      },
      {
        label: "Global",
        name: "global",
        path: "content/global",
        format: "json",
        ui: {
          global: true,
        },
        fields: [
          {
            type: "object",
            label: "Header",
            name: "header",
            fields: [
              {
                type: "string",
                label: "Name",
                name: "name",
              },
              {
                type: "string",
                label: "Color",
                name: "color",
                options: [
                  { label: "Default", value: "default" },
                  { label: "Primary", value: "primary" },
                ],
              },
              {
                type: "object",
                label: "Nav Links",
                name: "nav",
                list: true,
                ui: {
                  itemProps: (item) => {
                    return { label: item?.label };
                  },
                  defaultItem: {
                    href: "home",
                    label: "Home",
                  },
                },
                fields: [
                  {
                    type: "string",
                    label: "Link",
                    name: "href",
                  },
                  {
                    type: "string",
                    label: "Label",
                    name: "label",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            label: "Footer",
            name: "footer",
            fields: [
              {
                type: "string",
                label: "Color",
                name: "color",
                options: [
                  { label: "Default", value: "default" },
                  { label: "Primary", value: "primary" },
                ],
              },
              {
                type: "object",
                label: "Social Links",
                name: "social",
                fields: [
                  {
                    type: "string",
                    label: "Facebook",
                    name: "facebook",
                  },
                  {
                    type: "string",
                    label: "Twitter",
                    name: "twitter",
                  },
                  {
                    type: "string",
                    label: "Instagram",
                    name: "instagram",
                  },
                  {
                    type: "string",
                    label: "Github",
                    name: "github",
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            label: "Theme",
            name: "theme",
            // @ts-ignore
            fields: [
              {
                type: "string",
                label: "Primary Color",
                name: "color",
                ui: {
                  component: ColorPickerInput,
                },
              },
              {
                type: "string",
                name: "font",
                label: "Font Family",
                options: [
                  {
                    label: "System Sans",
                    value: "sans",
                  },
                  {
                    label: "Nunito",
                    value: "nunito",
                  },
                  {
                    label: "Lato",
                    value: "lato",
                  },
                  {
                    label: "Montserrat",
                    value: "montserrat",
                  },
                  {
                    label: "Veranda",
                    value: "veranda",
                  },
                ],
              },
              {
                type: "string",
                name: "darkMode",
                label: "Dark Mode",
                options: [
                  {
                    label: "System",
                    value: "system",
                  },
                  {
                    label: "Light",
                    value: "light",
                  },
                  {
                    label: "Dark",
                    value: "dark",
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        label: "Authors",
        name: "author",
        path: "content/authors",
        format: "md",
        fields: [
          {
            type: "string",
            label: "Name",
            name: "name",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            label: "Avatar",
            name: "avatar",
          },
        ],
      },
      {
        label: "Pages",
        name: "page",
        path: "content/pages",
        ui: {
          router: ({ document }) => {
            if (document._sys.filename === "home") {
              return `/`;
            }
            if (document._sys.filename === "about") {
              return `/about`;
            }
            return undefined;
          },
        },
        fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
            description:
              "The title of the page. This is used to display the title in the CMS",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            label: "Description",
            name: "description",
          },
          {
            type: "object",
            list: true,
            name: "blocks",
            label: "Sections",
            ui: {
              visualSelector: true,
            },
            templates: [
              heroBlockSchema,
              // @ts-ignore
              featureBlockSchema,
              featuredPostsBlockSchema,
              contentBlockSchema,
              testimonialBlockSchema,
            ],
          },
        ],
      },
      {
        label: "Categories",
        name: "category",
        path: "content/categories",
        format: "mdx",
                fields: [
          {
            type: "string",
            label: "Title",
            name: "title",
            isTitle: true,
            required: true,
          },
          {
            type: "string",
            label: "Description",
            name: "description",
          },
          {
            type: "string",
            label: "Category",
            name: "category",
            required: true, 
          },
          {
            type: "image",
            name: "heroImg",
            label: "Hero Image",
          },
          {
            type: "rich-text",
            label: "Body",
            name: "_body",
            templates: [
              {
                name: "DateTime",
                label: "Date & Time",
                inline: true,
                fields: [
                  {
                    name: "format",
                    label: "Format",
                    type: "string",
                    options: ["utc", "iso", "local"],
                  },
                ],
              },
              {
                name: "BlockQuote",
                label: "Block Quote",
                fields: [
                  {
                    name: "children",
                    label: "Quote",
                    type: "rich-text",
                  },
                  {
                    name: "authorName",
                    label: "Author",
                    type: "string",
                  },
                ],
              },
              {
                name: "NewsletterSignup",
                label: "Newsletter Sign Up",
                fields: [
                  {
                    name: "children",
                    label: "CTA",
                    type: "rich-text",
                  },
                  {
                    name: "placeholder",
                    label: "Placeholder",
                    type: "string",
                  },
                  {
                    name: "buttonText",
                    label: "Button Text",
                    type: "string",
                  },
                  {
                    name: "disclaimer",
                    label: "Disclaimer",
                    type: "rich-text",
                  },
                ],
                ui: {
                  defaultItem: {
                    placeholder: "Enter your email",
                    buttonText: "Notify Me",
                  },
                },
              },
            ],
            isBody: true,
          },
        ],
      },
    ],
  },
});

export default config;
