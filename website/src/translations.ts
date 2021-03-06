import { ErrorCode, ErrorPageContent, Language } from "./models";

export interface Translation {
  readonly footer: string;
  readonly loading: string;
  readonly language: string;
  readonly guest: string;
  readonly pipeDesigner: {
    title: string;
    body: string;
  };
  readonly profile: {
    title: string;
    body: string;
    loading: string;
    invalidCredentials: string;
    readonly formDetails: {
      name: string;
      surname: string;
      email: string;
      password: string;
      passwordRepeat: string;
      login: string;
      signup: string;
      or: string;
      haveAccountAlready: string;
      logout: string;
    };
  };
  readonly contentManager: {
    title: string;
    selectedPage: string;
    addPage: string;
    readonly formDetails: {
      title: string;
      url: string;
      adminOnly: string;
      shouldFetch: string;
      update: string;
    };
  };
  readonly error: { [code in ErrorCode]: ErrorPageContent };
}

const TRANSLATIONS: { [lang in Language]: Translation } = {
  EN: {
    footer: "{YEAR} \u00a9 Konrad Guzek",
    loading: "Loading",
    language: "Language",
    guest: "Guest",
    pipeDesigner: {
      title: "Pipe Designer",
      body: "Redirecting to the pipe designer failed. Please try again later, or refresh your page manually.",
    },
    profile: {
      title: "Profile",
      body: "Welcome to your profile!",
      loading: "Validating",
      invalidCredentials: "Invalid credentials.",
      formDetails: {
        name: "Name",
        surname: "Surname",
        email: "Email",
        password: "Password",
        passwordRepeat: "Repeat password",
        login: "Log In",
        signup: "Sign Up",
        or: "or",
        haveAccountAlready: "have an account already?",
        logout: "Log out",
      },
    },
    error: {
      403: {
        title: "403 Forbidden",
        body: "403: You do not have permission to view this resource.",
      },
      404: {
        title: "404 Not Found",
        body: "404: The requested resource was not found.",
      },
    },
    contentManager: {
      title: "Content Manager",
      selectedPage: "Selected page",
      addPage: "Create page",
      formDetails: {
        title: "Title",
        url: "URL",
        adminOnly: "Admin only",
        shouldFetch: "Edit page contents",
        update: "Update",
      },
    },
  },
  PL: {
    footer: "{YEAR} \u00a9 Konrad Guzek",
    loading: "Trwa ??adowanie strony",
    language: "J??zyk",
    guest: "Go????",
    pipeDesigner: {
      title: "Kreator Rur",
      body: "Przekierowywanie do kreatora rur nie powiod??o si??. Spr??buj ponownie wkr??tce lub od??wie?? stron?? r??cznie.",
    },
    profile: {
      title: "Profil",
      body: "Witamy na Twoim profilu!",
      loading: "Trwa walidacja",
      invalidCredentials: "Niepoprawne dane loginowe.",
      formDetails: {
        name: "Imi??",
        surname: "Nazwisko",
        email: "Email",
        password: "Has??o",
        passwordRepeat: "Has??o (ponownie)",
        login: "Zaloguj si??",
        signup: "Za?????? konto",
        or: "lub",
        haveAccountAlready: "masz ju?? konto?",
        logout: "Wyloguj si??",
      },
    },
    error: {
      403: {
        title: "403 Zabroniono",
        body: "403: Nie masz uprawnie?? do wy??wietlania tego zasobu.",
      },
      404: {
        title: "404 Nie Znaleziono",
        body: "404: Nie znaleziono zasobu, kt??rego szukasz.",
      },
    },
    contentManager: {
      title: "Edytor Tre??ci",
      selectedPage: "Wybrana strona",
      addPage: "Stw??rz stron??",
      formDetails: {
        title: "Tytu??",
        url: "URL",
        adminOnly: "Tylko dla administrator??w",
        shouldFetch: "Edytuj tre???? strony",
        update: "Zaktualizuj",
      },
    },
  },
};

export default TRANSLATIONS;
