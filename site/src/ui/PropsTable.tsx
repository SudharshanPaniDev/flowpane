export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export function PropsTable({ props, caption }: { props: PropDoc[]; caption: string }) {
  return (
    <div className="docs-table-scroll" tabIndex={0} role="region" aria-label={caption}>
      <table className="docs-table">
        <caption className="fp-visually-hidden">{caption}</caption>
        <thead>
          <tr>
            <th scope="col">Prop</th>
            <th scope="col">Type</th>
            <th scope="col">Default</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <th scope="row">
                <code>{prop.name}</code>
                {prop.required && <span className="docs-required">required</span>}
              </th>
              <td>
                <code className="docs-type">{prop.type}</code>
              </td>
              <td>{prop.default ? <code>{prop.default}</code> : <span aria-label="No default">—</span>}</td>
              <td>{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
