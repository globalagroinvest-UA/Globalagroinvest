import type { StructureResolver } from "sanity/structure";

/**
 * Custom desk structure so the manager sees a short, task-oriented menu
 * instead of Sanity's default alphabetical list of every schema type.
 * Singleton documents (settings + one-off pages) are pinned at the top and
 * opened directly — no "create new" step, since there is only ever one.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Контент сайту")
    .items([
      S.listItem()
        .title("Налаштування сайту")
        .id("siteSettings")
        .child(
          S.document().schemaType("siteSettings").documentId("siteSettings"),
        ),
      S.divider(),
      S.listItem()
        .title("Головна сторінка")
        .id("homePage")
        .child(S.document().schemaType("homePage").documentId("homePage")),
      S.listItem()
        .title("Про компанію")
        .id("aboutPage")
        .child(S.document().schemaType("aboutPage").documentId("aboutPage")),
      S.listItem()
        .title("Контакти (сторінка)")
        .id("contactsPage")
        .child(
          S.document().schemaType("contactsPage").documentId("contactsPage"),
        ),
      S.divider(),
      S.documentTypeListItem("category").title("Категорії продукції"),
      S.documentTypeListItem("product").title("Продукти"),
      S.documentTypeListItem("brand").title("Бренди / партнери"),
      S.documentTypeListItem("businessDirection").title("Напрямки бізнесу"),
      S.documentTypeListItem("advantage").title("Переваги компанії"),
      S.divider(),
      S.documentTypeListItem("newsPost").title("Новини"),
    ]);
