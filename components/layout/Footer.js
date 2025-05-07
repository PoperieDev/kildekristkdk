export default function Footer() {
  return (
    <footer className="footer grid place-items-center sm:footer-horizontal bg-neutral text-neutral-content relative">
      <div className="w-full h-full absolute bg-neutral blur-xl -z-10"></div>
      <div className="container footer sm:footer-horizontal p-10">
        <nav>
          <h6 className="footer-title">Info</h6>
          <a className="">Udviklet på HTX</a>
          <a className="">SO-Opgave projekt</a>
          <a className="">07/05/2025</a>
        </nav>
        <nav></nav>
        <nav></nav>
      </div>
    </footer>
  );
}
