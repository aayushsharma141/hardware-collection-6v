import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Hardware Collection')
    .items([
      S.listItem()
        .title('Hardware Collection')
        .child(
          S.list()
            .title('Hardware Collection')
            .items([
              S.documentTypeListItem('product').title('Products'),
              S.documentTypeListItem('brand').title('Brands'),
              S.documentTypeListItem('testimonial').title('Testimonials'),
            ])
        ),
      S.listItem()
        .title('Shape of the catalog')
        .child(
          S.list()
            .title('Shape of the catalog')
            .items([
              S.documentTypeListItem('category').title('Categories'),
              S.documentTypeListItem('subcategory').title('Subcategories'),
              S.documentTypeListItem('curatedCollection').title('Curated Collections'),
              S.documentTypeListItem('space').title('Spaces'),
            ])
        ),
      S.listItem()
        .title('Pages')
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Homepage')
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                ),
            ])
        ),
      S.listItem()
        .title('Rarely and carefully')
        .child(
          S.list()
            .title('Rarely and carefully')
            .items([
              S.listItem()
                .title('Site Settings')
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                ),
              S.listItem()
                .title('Navigation')
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                ),
            ])
        ),
      S.divider(),
      S.listItem()
        .title('Needs photos')
        .child(
          S.documentList()
            .title('Products missing photos')
            .filter('_type == "product" && (!defined(images) || length(images) == 0)')
        ),
      S.listItem()
        .title('Drafts waiting for review')
        .child(
          S.documentList()
            .title('Drafts waiting for review')
            .filter('_id in path("drafts.**")')
        ),
    ])
