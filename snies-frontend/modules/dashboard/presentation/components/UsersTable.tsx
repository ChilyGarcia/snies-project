export function UsersTable() {
    const users = [
        { id: 1, name: "Juan Pérez", role: "Estudiante" },
        { id: 2, name: "Ana Gómez", role: "Docente" },
        { id: 3, name: "Carlos Ruiz", role: "Administrador" },
    ];
    return (<div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2">Nombre</th>
              <th className="text-left py-2">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (<tr key={u.id} className="border-b last:border-0">
                <td className="py-2">{u.name}</td>
                <td className="py-2">{u.role}</td>
              </tr>))}
          </tbody>
        </table>
      </div>);
}
