# ⚡ Amply

**Your content, your rules. Real impressions, full ownership. The future of music is human.**

🎵 **Category**: Audio/Video  
🌐 **Demo**: [https://amply-seven.vercel.app/](https://amply-seven.vercel.app/)

## Our Vision for Amply

Amply stems from a bold vision: to reimagine a creative economy where **human authenticity** and **artist sovereignty** are the fundamental pillars. In the current digital content landscape, creators battle against invisibility, monetization diluted by fraud, and a loss of control over their works. We believe in a future where every interaction truly counts, every support is genuine, and every artist freely owns the fruit of their passion.

Amply is our answer to that vision. We are more than a decentralized digital content platform; we are a manifesto for real value and human connection in digital art. Our core purpose is to eradicate deception and empower creators like never before, building an ecosystem where:

* **Authenticity is the Primary Currency**: We envision a world where engagement metrics are irrefutable. Amply ensures that every impression, every content access, and every show of support comes from a real, unique human, verified by **World ID**. This not only combats fraud but forges an unbreakable foundation of trust between creators and audiences, allowing value to flow towards those who truly inspire and connect.

* **Creator Sovereignty is Sacred**: Our vision is to return full control over their legacy to artists. We empower creators so that the ownership of their master recordings is immutably theirs, secured by solutions like **Ledger hardware wallets**, and the management of these invaluable assets rests solely in their hands. Beyond that, we envision a world where artist content cannot be censored or deleted, living freely and permanently accessible, stored on the **Walrus decentralized network**.

* **A Fair and Connected Community**: We strive to build a space where genuine connection flourishes. This is an ecosystem where fans can confidently support their favorite artists, and creators are directly rewarded for the authentic impact they generate in the world, fostering deeper, more meaningful relationships that transcend superficial metrics.

Amply is the future of digital content value exchange and creation: a digital space where human passion meets technology to forge a virtuous cycle of value, authenticity, and artistic freedom. It's a call to a new standard, where art is truly free and creators are truly sovereign.

## How it's Made

Amply is a robust and decentralized Web3 application designed to create a fair and transparent ecosystem for creators and audiences. It achieves this by fusing several cutting-edge technologies:

### Technical Architecture

* **Frontend**: Amply's user interface is built with **React/Next.js**, ensuring a fast and responsive experience. It's deployed on **Vercel**, optimized for the World mini-app.

* **Blockchain Core**: The application's core logic, including NFT ownership, tipping transactions, and logging of verified interactions, is implemented with **Smart Contracts on the World chain network**. This network was chosen for its low gas fees and high transaction speed, which are crucial for an application with micro-interactions. While currently on the Testnet for hackathon purposes, it's designed for scalability to the Mainnet.

* **Human Identity Verification (World ID)**: Amply integrates the **World ID SDK** to allow users to privately verify their humanity using Zero-Knowledge Proofs (ZKPs). This is a foundational feature for "quantifying real impressions," ensuring that content access, tips, and other interactions originate from unique, genuine users, effectively preventing bot fraud.

* **Master Ownership (NFTs & Ledger)**: Master NFTs are custom **ERC-721 contracts** deployed on Worldchain. These NFTs contain metadata that links to the original content. Amply demonstrates how artists can connect their **Ledger hardware wallets** via WalletConnect (or similar) to securely self-custody these master NFTs, emphasizing true artist control over their work. All transactions implement **ERC-7730 Clear Signing** for transparent, human-readable transaction approval. See `/docs/ERC7730_CLEAR_SIGNING_GUIDE.md` for implementation details.

* **Decentralized Content Storage (Walrus.xyz)**: All audio and video files, along with associated content, are uploaded and stored using **Walrus.xyz**. This platform provides a robust, decentralized storage solution, ensuring content is permanent, always available, and censorship-resistant, without relying on central servers. The Content ID (CID) of each file from Walrus.xyz is obtained and stored within the NFT's metadata on the blockchain, ensuring content immutability and accessibility from a distributed network. See `/docs/WALRUS_IMPLEMENTATION_GUIDE.md` for specific API integration examples.

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/D9J9V/amply.git
cd amply

# Install dependencies
pnpm install
```

### Development

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
# Create production build
pnpm build

# Start production server
pnpm start
```

## Tech Stack

- **Framework**: Next.js 15.3.5 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Blockchain**: World chain network
- **Identity**: World ID SDK
- **Storage**: Walrus decentralized storage
- **Hardware Wallet**: Ledger integration for secure NFT custody with ERC-7730 Clear Signing
- **Deployment**: Vercel

## Application Routes

### Route Structure Diagram

```
/
├── Home (Music discovery hub)
│   ├── New Music Section
│   ├── Playlists Section
│   └── Trends Section
│
├── /artist/[handle]
│   ├── Artist Profile (Default view)
│   └── (Nested layouts with persistent menu)
│       ├── /dashboard     → Analytics & insights
│       ├── /masters       → NFT master recordings
│       ├── /upload        → Content upload interface
│       ├── /monetization  → Earnings & tipping
│       └── /settings      → Profile configuration
│
├── /feed/[genres]
│   └── (Genre-based music feeds)
│       ├── /feed/rock
│       ├── /feed/indie
│       ├── /feed/pop
│       └── /feed/[dynamic-genre]
│
└── /test
    └── (Development testing routes)
        ├── /test/world      → World ID integration tests
        ├── /test/ledger     → Ledger wallet integration tests
        └── /test/walrus     → Walrus storage integration tests
```

### Route Descriptions

#### **`/` - Home Page**
The main entry point of Amply, designed as a music discovery hub featuring:
- **New Music**: Showcases recently uploaded tracks with verified human impressions
- **Playlists**: Curated collections by verified users and artists
- **Trends**: Real-time trending content based on authentic engagement metrics

#### **`/artist/[handle]` - Artist Profile & Dashboard**
Dynamic artist pages with a persistent navigation menu across all subroutes:

- **Main Profile**: Public-facing artist page displaying bio, featured tracks, and verified metrics
- **`/artist/[handle]/dashboard`**: Private analytics dashboard showing:
  - Real human impression counts
  - Engagement metrics (tips, shares, playlist adds)
  - Audience demographics (anonymized via World ID)
  - Revenue analytics

- **`/artist/[handle]/masters`**: NFT master recordings management:
  - View all minted master NFTs
  - Transfer ownership controls
  - Ledger wallet integration for secure custody
  - Smart contract interaction history

- **`/artist/[handle]/upload`**: Content upload interface:
  - Audio/video file upload to Walrus network
  - Metadata entry (title, description, genre)
  - Master NFT minting options
  - Publishing controls

- **`/artist/[handle]/monetization`**: Revenue management:
  - Tip collection history
  - Withdrawal options
  - Fan support analytics
  - Direct monetization settings

- **`/artist/[handle]/settings`**: Profile configuration:
  - Artist bio and social links
  - Verification status (World ID)
  - Privacy preferences
  - Notification settings

#### **`/feed/[genres]` - Genre Feeds**
Dynamic content feeds organized by musical genres:
- **Dynamic Genre Routes**: `/feed/rock`, `/feed/indie`, `/feed/pop`, etc.
- **Filtered Content**: Only shows tracks from verified human uploads
- **Engagement Sorting**: Prioritizes content with authentic interactions
- **Genre Discovery**: Helps users explore specific musical styles

Each feed maintains a consistent layout while dynamically loading genre-specific content, ensuring authentic discovery experiences free from bot manipulation.

#### **`/test` - Development Testing Routes**
Isolated testing environments for each major integration:

- **`/test/world`**: World ID integration testing:
  - Human verification flow testing
  - Zero-Knowledge Proof generation
  - Authentication token validation
  - Mock verification for development

- **`/test/ledger`**: Ledger hardware wallet testing:
  - WalletConnect integration
  - NFT signing flows
  - Transaction approval UI
  - Hardware wallet detection

- **`/test/walrus`**: Walrus storage testing:
  - File upload/download flows
  - Blob ID management
  - Content retrieval testing
  - Network performance monitoring

These test routes are isolated from the main application flow and provide dedicated environments for debugging integration issues with clear separation of concerns.

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.