import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-orange-500 p-4">
      <h1 className="text-2xl font-bold">RARD</h1>
      <nav>
        <Link href="/">Home</Link>
      </nav>
    </header>
  );
};

export default Header;
