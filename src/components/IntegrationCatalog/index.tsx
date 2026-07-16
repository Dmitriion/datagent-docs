import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export type CatalogItem = {
  name: string;
  href: string;
  outcome: string;
  tools: number;
  status: 'available' | 'developing';
};

export type CatalogCategory = {
  title: string;
  items: CatalogItem[];
};

export type IntegrationCatalogProps = {
  categories: CatalogCategory[];
  heading?: string;
};

export default function IntegrationCatalog({
  categories,
  heading = 'Каталог интеграций',
}: IntegrationCatalogProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby="integration-catalog-heading">
      <h2 id="integration-catalog-heading">{heading}</h2>
      <div className={styles.categories}>
        {categories.map((category) => (
          <div key={category.title} className={styles.category}>
            <h3 className={styles.categoryTitle}>{category.title}</h3>
            <ul className={styles.list}>
              {category.items.map((item) => (
                <li key={item.href} className={styles.card}>
                  <div className={styles.cardTop}>
                    <Link className={styles.name} to={item.href}>
                      {item.name}
                    </Link>
                    <span
                      className={
                        item.status === 'developing' ? styles.statusDev : styles.statusOk
                      }
                    >
                      {item.status === 'developing' ? 'Развивается' : 'Доступно'}
                    </span>
                  </div>
                  <p className={styles.outcome}>{item.outcome}</p>
                  <div className={styles.cardBottom}>
                    <span className={styles.tools}>{item.tools} инструментов</span>
                    <Link className={styles.more} to={item.href}>
                      Посмотреть возможности
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
