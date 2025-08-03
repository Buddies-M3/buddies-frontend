import { Fragment } from "react";
import BoxLink from "./box-link";
import { FlexBox, FlexRowCenter } from "components/flex-box";

const LoginBottom = () => {
  return <Fragment>
      {
      /* DON'T HAVE ACCOUNT AREA */
    }
      <FlexRowCenter gap={1} my={3} style={{opacity: 0.5}}>
        Don&apos;t have account?
        <span style={{color: '#666', textDecoration: 'none', cursor: 'not-allowed'}}>Register (Disabled)</span>
      </FlexRowCenter>

      {
      /* FORGET YOUR PASSWORD AREA */
    }
      <FlexBox gap={1} py={2} borderRadius={1} justifyContent="center" bgcolor="grey.200" style={{opacity: 0.5}}>
        Forgot your password?
        <span style={{color: '#666', textDecoration: 'none', cursor: 'not-allowed'}}>Reset It (Disabled)</span>
      </FlexBox>
    </Fragment>;
};

export default LoginBottom;