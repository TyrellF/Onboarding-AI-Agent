import Image from "next/image";

export default function Header() {
  return (
    <header
      style={{
        background: "#0070CC",
        padding: "0.25rem 1rem",
        color: "white",
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100x",
      }}
    >
      <Image
        src="/elanco-header.png"
        alt="Elanco IAC Logo"
        height={80}
        width={80}
        priority
      />
      <h1 style={{ marginLeft: "4px", fontSize: "1rem", fontWeight: "bold" }}>
        IAC, India
      </h1>
    </header>
  );
}
