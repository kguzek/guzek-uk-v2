import React, { useContext, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen/LoadingScreen";
import {
  ModalContext,
  TranslationContext,
  useFetchContext,
} from "../../misc/context";
import { User } from "../../misc/models";
import { getErrorMessage } from "../../misc/util";
import { AdminContext } from "./Base";

export default function Users() {
  const { users, setUsers, setTitle } = useOutletContext<AdminContext>();
  const { setModalChoice, setModalError, setModalInfo } =
    useContext(ModalContext);
  const { fetchFromAPI } = useFetchContext();
  const data = useContext(TranslationContext);

  useEffect(() => {
    setTitle(data.admin.users.title);
  }, []);

  // TODO: Change to skeleton
  if (!users) return <LoadingScreen />;

  async function confirmDelete(user: User) {
    const primary = await setModalChoice(data.admin.users.confirmDelete);
    if (!primary) return;
    await deleteUser(user);
  }

  async function deleteUser(user: User) {
    try {
      const res = await fetchFromAPI(`auth/users/${user.uuid}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setModalInfo(data.admin.users.deleted(user.username));
        setUsers(
          (old) => old?.filter((some) => some.uuid !== user.uuid) ?? null
        );
      } else {
        const json = await res.json();
        setModalError(getErrorMessage(res, json, data));
      }
    } catch (error) {
      console.error(error);
      setModalError(data.networkError);
    }
  }

  return (
    <div>
      <h3>{data.admin.users.title}</h3>
      <div className="users flex-column">
        <div className="cards flex-column gap-10">
          {users.map((user, idx) => (
            <div key={idx} className="clickable card-container no-overflow">
              <Link to={user.uuid} className="card user flex gap-15">
                <i
                  className={`fa-solid fa-user ${user.admin ? "admin" : ""}`}
                ></i>
                <div>
                  <div className="flex">
                    <i>{user.username}</i>
                  </div>
                  <div className="serif regular">{user.email}</div>
                </div>
                <i className="fa-solid fa-gear"></i>
              </Link>
              <div className="delete" onClick={() => confirmDelete(user)}>
                <i className="fa-solid fa-trash"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

