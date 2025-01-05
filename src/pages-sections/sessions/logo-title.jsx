import Image from "next/image"; // CUSTOM COMPONENTS

import { H5 } from "components/Typography";
import { FlexRowCenter } from "components/flex-box";
import Link from "next/link";

const LogoWithTitle = () => {
  return <FlexRowCenter flexDirection="column" gap={1.5} mb={4}>
    <Link href='/'>
      <Image src={require("../../../public/assets/images/icons/logo.png")} alt="bazaar" style={{maxWidth: '200px'}}/>
      </Link>
      {/* <H5 fontWeight={700}>Welcome To Bazaar</H5> */}
    </FlexRowCenter>;
};

export default LogoWithTitle;