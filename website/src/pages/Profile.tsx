import React, { MouseEvent, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchFromAPI } from "../misc/backend";
import { User } from "../misc/models";
import { Translation } from "../misc/translations";
import { setTitle } from "../misc/util";

function Profile({
  data,
  user,
  setUser,
}: {
  data: Translation;
  user: User | null;
  setUser: Function;
}) {
  async function handleLogOut(_evt: MouseEvent<HTMLButtonElement>) {
    const token = localStorage.getItem("refreshToken");
    await fetchFromAPI("auth/token", {
      method: "DELETE",
      body: { token },
    });
    localStorage.removeItem("user");
    localStorage.removeItem("accessTokenInfo");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }

  useEffect(() => {
    setTitle(data.profile.title);
  }, [data]);

  if (!user) {
    return (
      <div className="form">
        <Link to="/login" className="btn">
          {data.profile.formDetails.login}
        </Link>
      </div>
    );
  }
  const userCreatedAt = new Date(user.created_at);
  return (
    <div className="text">
      <p>{data.profile.body}</p>
      <p>Administrator: {user.admin.toString()}</p>
      <p>
        {data.profile.formDetails.username}: {user.username}
      </p>
      <p>
        {data.profile.formDetails.email}: {user.email}
      </p>
      <small>
        Unique user ID: <span>{user.uuid}</span>
      </small>
      <br />
      <small>Account created on {userCreatedAt.toString()}</small>
      <div className="form">
        <button className="btn btn-submit" onClick={handleLogOut}>
          {data.profile.formDetails.logout}
        </button>
      </div>
    </div>
  );
}

export default Profile;
