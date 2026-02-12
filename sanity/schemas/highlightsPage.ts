import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'highlightsPage',
  title: 'Highlights Page',
  type: 'document',
  fields: [
    defineField({
      name: 'images',
      title: 'Highlight Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
      description: 'Select and order images to display on the Highlights page',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Highlights Page',
      };
    },
  },
});
