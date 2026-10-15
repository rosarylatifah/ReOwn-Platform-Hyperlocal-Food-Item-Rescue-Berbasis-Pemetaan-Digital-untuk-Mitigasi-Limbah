/** Sel pengguna: avatar inisial + username tebal + email kecil. */
export default function UserCell({ username, email }: { username: string; email?: string }) {
  return (
    <div className="adm-user">
      <span className="adm-av" aria-hidden>{username.slice(0, 1).toUpperCase()}</span>
      <div>
        <b>{username}</b>
        {email && <small>{email}</small>}
      </div>
    </div>
  );
}