// v1
// import { useGetCaptchaUrlQuery } from "@/features/auth/api/authApi";

// export const Captcha = () => {
//   const { data, isLoading, isError, refetch } = useGetCaptchaUrlQuery();
//   if (isLoading) return <div>Загрузка капчи...</div>;
//   if (isError) return <div>Ошибка загрузки капчи</div>;

//   // Получаем первый элемент массива
//   const captchaData = data?.url;
  
//   // Проверяем, что captchaData существует и содержит поле url
//   if (!captchaData) {
      
//     return <div>Не удалось найти URL капчи</div>;
//   }

//   return (
//     <div>
//       <img src={captchaData} alt="CAPTCHA" />
//       <button type="button" onClick={refetch}>🔄 Обновить капчу</button>
//     </div>
//   );
// };

// v2 - последняя рабочая версия
// import { useGetCaptchaUrlQuery } from "@/features/auth/api/authApi";

// export const Captcha = () => {
//   const { data, isLoading, isError, refetch } = useGetCaptchaUrlQuery();

//   if (isLoading) return <div>Загрузка капчи...</div>;
//   if (isError)
//     return (
//       <button onClick={refetch} style={{ color: "red" }}>
//         ❌ Ошибка загрузки капчи. Нажмите, чтобы попробовать снова.
//       </button>
//     );

//   return (
//     <div style={{ textAlign: "center", margin: "10px 0" }}>
//       <img src={data?.url} alt="CAPTCHA" />
//       <br />
//       <button
//         type="button"
//         onClick={refetch}
//         style={{ background: "none", border: "none", cursor: "pointer", marginTop: "5px" }}
//       >
//         🔄 Обновить капчу
//       </button>
//     </div>
//   );
// };

// v3
import { useGetCaptchaUrlQuery } from "@/features/auth/api/authApi";

export const Captcha = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCaptchaUrlQuery();

  if (isLoading) return <div>Загрузка капчи...</div>;
  if (isError) {
    console.error("Ошибка загрузки капчи:", error);
    return (
      <div style={{ color: "red" }}>
        Ошибка загрузки капчи.{" "}
        <button onClick={refetch} style={{ marginLeft: "8px" }}>
          🔄 Повторить
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: "center", margin: "10px 0" }}>
      <img src={data?.url} alt="CAPTCHA" />
      <br />
      <button
        type="button"
        onClick={refetch}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          marginTop: "5px",
        }}
      >
        🔄 Обновить капчу
      </button>
    </div>
  );
};