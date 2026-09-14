"use client";

import styles from "../app/page.module.css";

type NavbarProps = {
  onNewSearch?: () => void;
  showNewSearch?: boolean;
};

export default function Navbar({
  onNewSearch,
  showNewSearch = false,
}: NavbarProps) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            TP
          </div>

          <h2 className={styles.brandName}>
            Talent Pool
          </h2>
        </div>

        {showNewSearch && onNewSearch && (
          <button
            type="button"
            className={styles.newSearchButton}
            onClick={onNewSearch}
          >
            <span className={styles.newSearchIcon}>
              +
            </span>
            New search
          </button>
        )}
      </div>
    </nav>
  );
}