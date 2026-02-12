import { groq } from 'next-sanity';

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteTitle,
    contactEmail,
    theme
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(order asc) {
    _id,
    title,
    slug,
    thumbnail,
    "thumbnailAlt": thumbnail.alt
  }
`;

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    description,
    images[] {
      asset,
      alt
    },
    technicalInfo[] {
      label,
      value
    }
  }
`;

export const highlightsQuery = groq`
  *[_type == "highlightsPage"][0] {
    images[] {
      asset,
      alt
    }
  }
`;

export const aboutPageQuery = groq`
  *[_type == "aboutPage"][0] {
    title,
    introText,
    slideshow[] {
      asset,
      alt
    },
    sections[] {
      title,
      content
    }
  }
`;
