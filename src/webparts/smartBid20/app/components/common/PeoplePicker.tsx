/**
 * PeoplePicker — reusable Microsoft Graph people search field.
 * Searches AAD users (displayName / mail), loads photos in the background,
 * and returns the selected person (name + email + photoUrl).
 */
import * as React from "react";
import { useSpfxContext } from "../../config/SpfxContext";
import styles from "./PeoplePicker.module.scss";

export interface IPickedPerson {
  name: string;
  email: string;
  photoUrl: string;
  jobTitle?: string;
}

interface IGraphResult extends IPickedPerson {
  id: string;
}

interface PeoplePickerProps {
  label?: string;
  placeholder?: string;
  value: IPickedPerson | null;
  onChange: (person: IPickedPerson | null) => void;
  disabled?: boolean;
}

export const PeoplePicker: React.FC<PeoplePickerProps> = ({
  label,
  placeholder = "Search people…",
  value,
  onChange,
  disabled,
}) => {
  const spfxContext = useSpfxContext();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<IGraphResult[]>([]);
  const [open, setOpen] = React.useState(false);
  const [searching, setSearching] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const search = React.useCallback(
    async (q: string) => {
      if (!q || q.length < 2) {
        setResults([]);
        setOpen(false);
        return;
      }
      setSearching(true);
      try {
        const client = await spfxContext.msGraphClientFactory.getClient("3");
        const response = await client
          .api("/users")
          .filter(`startswith(displayName,'${q}') or startswith(mail,'${q}')`)
          .select("id,displayName,mail,userPrincipalName,jobTitle")
          .top(8)
          .get();
        const list: IGraphResult[] = (response.value || []).map(
          (u: {
            id: string;
            displayName: string;
            mail: string;
            userPrincipalName: string;
            jobTitle: string;
          }) => ({
            id: u.id,
            name: u.displayName || "",
            email: u.mail || u.userPrincipalName || "",
            jobTitle: u.jobTitle || "",
            photoUrl: "",
          }),
        );
        setResults(list);
        setOpen(list.length > 0);
        // fetch photos in background
        list.forEach((person, idx) => {
          client
            .api(`/users/${person.id}/photo/$value`)
            .get()
            .then((blob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const b64 = (reader.result as string).split(",")[1];
                const url = `data:image/jpeg;base64,${b64}`;
                setResults((prev) => {
                  const next = [...prev];
                  if (next[idx] && next[idx].id === person.id) {
                    next[idx] = { ...next[idx], photoUrl: url };
                  }
                  return next;
                });
              };
              reader.readAsDataURL(blob);
            })
            .catch(() => {
              /* no photo */
            });
        });
      } catch (err) {
        console.error("PeoplePicker search failed", err);
        setResults([]);
        setOpen(false);
      } finally {
        setSearching(false);
      }
    },
    [spfxContext],
  );

  const onQueryChange = (q: string): void => {
    setQuery(q);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      search(q).catch(console.error);
    }, 300);
  };

  React.useEffect(() => {
    const onClickOutside = (e: MouseEvent): void => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const pick = (person: IGraphResult): void => {
    onChange({
      name: person.name,
      email: person.email,
      photoUrl: person.photoUrl,
      jobTitle: person.jobTitle,
    });
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  const initials = (name: string): string =>
    name
      .split(" ")
      .map((p) => p[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className={styles.wrapper} ref={rootRef}>
      {label && <div className={styles.label}>{label}</div>}

      {value ? (
        <div className={styles.selected}>
          {value.photoUrl ? (
            <img
              className={styles.avatar}
              src={value.photoUrl}
              alt={value.name}
            />
          ) : (
            <span className={styles.avatarFallback}>
              {initials(value.name)}
            </span>
          )}
          <div className={styles.selectedInfo}>
            <span className={styles.selectedName}>{value.name}</span>
            <span className={styles.selectedEmail}>{value.email}</span>
          </div>
          {!disabled && (
            <button
              type="button"
              className={styles.clearBtn}
              aria-label="Remove selected person"
              onClick={() => onChange(null)}
            >
              ×
            </button>
          )}
        </div>
      ) : (
        <div className={styles.inputRow}>
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={query}
            disabled={disabled}
            onChange={(e) => onQueryChange(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
          />
          {searching && <span className={styles.spinner} aria-hidden="true" />}
          {open && results.length > 0 && (
            <div className={styles.dropdown}>
              {results.map((r) => (
                <button
                  type="button"
                  key={r.id}
                  className={styles.option}
                  onClick={() => pick(r)}
                >
                  {r.photoUrl ? (
                    <img
                      className={styles.avatar}
                      src={r.photoUrl}
                      alt={r.name}
                    />
                  ) : (
                    <span className={styles.avatarFallback}>
                      {initials(r.name)}
                    </span>
                  )}
                  <div className={styles.optionInfo}>
                    <span className={styles.optionName}>{r.name}</span>
                    <span className={styles.optionEmail}>{r.email}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
