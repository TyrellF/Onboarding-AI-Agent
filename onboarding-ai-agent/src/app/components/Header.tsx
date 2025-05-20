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
        justifyContent: "flex-start",
        alignItems: "center",
        height: "50px",
      }}
    >
      <Image
        src="/elanco-header.png"
        alt="Elanco IAC Logo"
        height={80}
        width={80}
        priority
      />
      <h1
        style={{
          marginLeft: "570px",
          fontSize: "1.6rem",
          fontWeight: "bold",
        }}
      >
        Onboarding AI Agent
      </h1>
    </header>
  );
}
