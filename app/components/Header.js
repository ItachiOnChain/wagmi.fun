import { ethers } from "ethers"

function Header({ account, setAccount }) {
  async function connectHandler() {
    if (!window.ethereum) {
        alert("MetaMask or a Web3 wallet is required");
        return;
    }

    const telosTestnet = {
        chainId: "0x29", // Hexadecimal for 41
        chainName: "Telos Testnet",
        nativeCurrency: {
            name: "TLOS",
            symbol: "TLOS",
            decimals: 18
        },
        rpcUrls: ["https://testnet.telos.net/evm"],
        blockExplorerUrls: ["https://testnet.teloscan.io/"]
    };

    try {
        // Get the current chain ID
        const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

        if (currentChainId !== telosTestnet.chainId) {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: telosTestnet.chainId }]
            });
        }

        // Request account access
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = ethers.getAddress(accounts[0]);
        setAccount(account);
    } catch (error) {
        if (error.code === 4902) {
            // Chain not added, prompt user to add it
            try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [telosTestnet]
                });
            } catch (addError) {
                console.error("Failed to add Telos Testnet:", addError);
            }
        } else {
            console.error("Error connecting wallet:", error);
        }
    }
}


  return (
    <header>
      <p className="brand">Wagmi.fun</p>

      {account ? (
        <button onClick={connectHandler} className="btn--fancy">[ {account.slice(0, 6) + '...' + account.slice(38, 42)} ]</button>
      ) : (
        <button onClick={connectHandler} className="btn--fancy">[ connect ]</button>
      )}
    </header>
  );
}

export default Header;