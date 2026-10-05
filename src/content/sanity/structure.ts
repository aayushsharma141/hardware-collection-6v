import type { StructureResolver } from 'sanity/structure'
import {
  HomeIcon,
  CogIcon,
  MenuIcon,
  PackageIcon,
  TagIcon,
  StarIcon,
  BookOpenIcon,
  ImageIcon,
  MessageSquareIcon,
  HelpCircleIcon,
  FileTextIcon,
  ShieldIcon,
  FolderIcon,
  LayersIcon,
  AlertCircleIcon,
  EditIcon,
  BadgePercentIcon,
} from 'lucide-react'
import type { ComponentType } from 'react'
import { apiVersion } from './env'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Hardware Collection')
    .items([

      // ── SHOWROOM ──────────────────────────────────────────────────
      S.listItem()
        .title('Showroom')
        .icon(HomeIcon as ComponentType)
        .child(
          S.list()
            .title('Showroom')
            .items([
              S.listItem()
                .title('Homepage Content')
                .icon(HomeIcon as ComponentType)
                .child(
                  S.document()
                    .schemaType('homePage')
                    .documentId('homePage')
                    .title('Homepage Content')
                ),
              S.listItem()
                .title('Business Settings')
                .icon(CogIcon as ComponentType)
                .child(
                  S.document()
                    .schemaType('siteSettings')
                    .documentId('siteSettings')
                    .title('Business Settings')
                ),
              S.listItem()
                .title('Navigation')
                .icon(MenuIcon as ComponentType)
                .child(
                  S.document()
                    .schemaType('navigation')
                    .documentId('navigation')
                    .title('Navigation')
                ),
              S.documentTypeListItem('offer')
                .title('Offers & Deals')
                .icon(BadgePercentIcon as ComponentType),
            ])
        ),

      S.divider(),

      // ── CATALOGUE ─────────────────────────────────────────────────
      S.listItem()
        .title('Catalogue')
        .icon(PackageIcon as ComponentType)
        .child(
          S.list()
            .title('Catalogue')
            .items([
              S.documentTypeListItem('product')
                .title('Products')
                .icon(PackageIcon as ComponentType),
              S.documentTypeListItem('category')
                .title('Categories')
                .icon(TagIcon as ComponentType),
              S.documentTypeListItem('brand')
                .title('Brands')
                .icon(StarIcon as ComponentType),
              S.documentTypeListItem('catalogue')
                .title('Catalogues (PDFs)')
                .icon(BookOpenIcon as ComponentType),
              S.divider(),
              S.documentTypeListItem('space')
                .title('Spaces / Rooms')
                .icon(LayersIcon as ComponentType),
              S.documentTypeListItem('subcategory')
                .title('Sub-categories')
                .icon(FolderIcon as ComponentType),
            ])
        ),

      S.divider(),

      // ── CONTENT ───────────────────────────────────────────────────
      S.listItem()
        .title('Content')
        .icon(EditIcon as ComponentType)
        .child(
          S.list()
            .title('Content')
            .items([
              S.documentTypeListItem('testimonial')
                .title('Testimonials')
                .icon(MessageSquareIcon as ComponentType),
              S.documentTypeListItem('faq')
                .title('FAQs')
                .icon(HelpCircleIcon as ComponentType),
              S.documentTypeListItem('gallery')
                .title('Gallery')
                .icon(ImageIcon as ComponentType),
            ])
        ),

      // ── LEGAL ─────────────────────────────────────────────────────
      S.listItem()
        .title('Legal Pages')
        .icon(ShieldIcon as ComponentType)
        .child(
          S.list()
            .title('Legal Pages')
            .items([
              S.listItem()
                .title('Privacy Policy')
                .icon(ShieldIcon as ComponentType)
                .child(
                  S.documentList()
                    .title('Privacy Policy')
                    .filter('_type == "legalPage" && slug.current == "privacy-policy"')
                    .apiVersion(apiVersion)
                ),
              S.listItem()
                .title('Terms & Conditions')
                .icon(FileTextIcon as ComponentType)
                .child(
                  S.documentList()
                    .title('Terms & Conditions')
                    .filter('_type == "legalPage" && slug.current == "terms-and-conditions"')
                    .apiVersion(apiVersion)
                ),
              S.documentTypeListItem('legalPage')
                .title('All Legal Documents')
                .icon(FileTextIcon as ComponentType),
            ])
        ),

      S.divider(),

      // ── WORKFLOW ─────────────────────────────────────────────────
      S.listItem()
        .title('Needs Review')
        .icon(AlertCircleIcon as ComponentType)
        .child(
          S.documentList()
            .title('Needs Review')
            .filter('editorial.needsReview == true')
            .apiVersion(apiVersion)
        ),
      S.listItem()
        .title('Unpublished Drafts')
        .icon(EditIcon as ComponentType)
        .child(
          S.documentList()
            .title('Unpublished Drafts')
            .filter('_id in path("drafts.**")')
            .apiVersion(apiVersion)
        ),
    ])
