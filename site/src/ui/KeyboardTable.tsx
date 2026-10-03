export interface KeyDoc {
  keys: string[];
  action: string;
}

export function KeyboardTable({ items, caption }: { items: KeyDoc[]; caption: string }) {
  return (
    <div className="docs-table-scroll">
      <table className="docs-table">
        <caption className="fp-visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Key</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.keys.join("+") + item.action}>
              <td>
                {item.keys.map((key, i) => (
                  <span key={key}>
                    {i > 0 && " + "}
                    <kbd>{key}</kbd>
                  </span>
                ))}
              </td>
              <td>{item.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
