export default function NavBar() {
  return (
    <div className="navbar grid place-items-center bg-base-100/50 backdrop-blur-xl z-50 shadow-sm fixed top-0 left-0">
      <div className="container navbar">
        <div className="navbar-start">
          <a className="btn btn-ghost text-xl">Kildekritisk.dk</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className="btn btn-ghost">Kilde tjekker</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <a className="btn">Log ind</a>
        </div>
      </div>
    </div>
  );
}
