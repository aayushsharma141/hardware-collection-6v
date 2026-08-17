import type {StructureResolver} from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Hardware Collection Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .child(
          S.document()
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.listItem()
        .title('Homepage Content')
        .child(
          S.document()
            .schemaType('homePage')
            .documentId('homePage')
        ),
      S.divider(),
      S.documentTypeListItem('category').title('Categories'),
      S.documentTypeListItem('brand').title('Brands'),
      S.documentTypeListItem('product').title('Products'),
      S.divider(),
      S.documentTypeListItem('testimonial').title('Testimonials'),
    ])
