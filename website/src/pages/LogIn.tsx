import React, { FormEvent, useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputBox from "../components/Forms/InputBox";
import LoadingScreen, {
  LoadingButton,
} from "../components/LoadingScreen/LoadingScreen";
import {
  AuthContext,
  ModalContext,
  TranslationContext,
  useFetchContext,
} from "../misc/context";
import { getUserFromResponse } from "../misc/util";

export default function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const data = useContext(TranslationContext);
  const { user, setUser } = useContext(AuthContext);
  const { fetchFromAPI } = useFetchContext();
  const { setModalError } = useContext(ModalContext);

  useEffect(() => {
    if (user) navigate("/profile");
  }, [user]);

  async function handleLogin(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setModalError();
    setLoading(true);
    const body = {
      email,
      password,
    };
    const res = await fetchFromAPI("auth/tokens", { method: "POST", body });
    const json = await res.json();
    setLoading(false);
    if (res.ok) {
      setUser(getUserFromResponse(json));
    } else {
      setModalError(data.profile.invalidCredentials);
    }
  }

  return (
    <>
      {user ? (
        <LoadingScreen className="flex-column" text={data.profile.loading} />
      ) : (
        <>
          <form className="form-login" onSubmit={handleLogin}>
            <InputBox
              label={data.profile.formDetails.email}
              type="email"
              value={email}
              name="email"
              setValue={setEmail}
            />
            <InputBox
              label={data.profile.formDetails.password}
              type="password"
              value={password}
              name="password"
              setValue={setPassword}
            />
            {loading ? (
              <LoadingButton />
            ) : (
              <button type="submit" className="btn btn-submit">
                {data.profile.formDetails.login}
              </button>
            )}
          </form>
          <div className="centred">
            <p>{data.profile.formDetails.or}</p>
            <Link to="/signup">
              <i>{data.profile.formDetails.signup}</i>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
