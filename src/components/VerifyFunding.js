import { useEffect } from "react";
import { useWallet } from "./walletContext";
import { useNavigate, useSearchParams } from "react-router";

const VerifyFunding = () => {
  const [searcParams] = useSearchParams();
  const navigate = useNavigate();

  const reference = searcParams.get("reference");

  const { verifyWalletFunding } = useWallet();

  useEffect(() => {
    if (!reference) {
      return;
    }

    const runVerification = async () => {
      const success = await verifyWalletFunding(reference);
      if (success) {
        navigate("/success", { replace: true });
      }
    };

    runVerification();
  }, [reference, navigate, verifyWalletFunding]);

  return <p>Verifying payment, please wait...</p>;
};

export default VerifyFunding;
