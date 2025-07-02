//Login.tsx
import { selectThemeMode, setIsLoggedInAC } from "@/app/app-slice"
import { AUTH_TOKEN } from "@/common/constants"
import { ResultCode } from "@/common/enums"
import { useAppDispatch, useAppSelector } from "@/common/hooks"
import { getTheme } from "@/common/theme"
import { useLoginMutation } from "@/features/auth/api/authApi"
import { type Inputs, loginSchema } from "@/features/auth/lib/schemas"
import { zodResolver } from "@hookform/resolvers/zod"
import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid2"
import TextField from "@mui/material/TextField"
import { Controller, type SubmitHandler, useForm } from "react-hook-form"
import styles from "./Login.module.css"
import { Captcha } from "@/common/components/Captcha/Captcha"
import { useState, useEffect } from "react"
import { useGetCaptchaUrlQuery } from "@/features/auth/api/authApi";

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)

  const [login] = useLoginMutation()

  const dispatch = useAppDispatch()

  const theme = getTheme(themeMode)

  const [showCaptcha, setShowCaptcha] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    resetField,
    control,
    setError,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", rememberMe: false, captcha: "" },
  })

  const {
      refetch,
    } = useGetCaptchaUrlQuery();

  // v1
  // const onSubmit: SubmitHandler<Inputs> = async (data) => {
  //   try {
  //     const res = await login(data).unwrap();

  //     if (res.resultCode === 0) {
  //       dispatch(setIsLoggedInAC({ isLoggedIn: true }));
  //       localStorage.setItem(AUTH_TOKEN, res.data.token);
  //       reset();
  //     }
  //   } catch (error: any) {
  //     if (error?.data?.resultCode === 10) {
  //       setShowCaptcha(true); // показываем капчу
  //     }
  //   }
  // };

  // v2
  // const onSubmit: SubmitHandler<Inputs> = (data) => {
  //   login(data).then((res) => {
  //     if (res.data?.resultCode === ResultCode.Success) {
  //       dispatch(setIsLoggedInAC({ isLoggedIn: true }))
  //       localStorage.setItem(AUTH_TOKEN, res.data.data.token)
  //       reset()
  //     }
  //   })
  // }

  // v3

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const payload = {
        ...data,
        ...(showCaptcha && { captcha: data.captcha.trim() }), // отправляем captcha только если она показана
      };

      const res = await login(payload).unwrap();

      if (res.resultCode === ResultCode.Success) {
        dispatch(setIsLoggedInAC({ isLoggedIn: true }));
        localStorage.setItem(AUTH_TOKEN, res.data.token);
        reset();
      } else if (res.resultCode === ResultCode.CaptchaError && res.fieldsErrors?.length > 0) {
        const captchaError = res.fieldsErrors.find(e => e.field === 'captcha');
        setError("captcha", { type: "custom", message: captchaError?.error });
        setShowCaptcha(true);
        resetField("captcha");
        refetch();
      } else if (res.resultCode !== ResultCode.Success) {
        const errorMessage = res.messages[0] || "An error occurred";
        setError("password", { type: "custom", message: errorMessage });
      }

      // const captchaError = res.fieldsErrors.find(
      //   (error) => error.field === "captcha"
      // )

      // const passError = res.messages[0]
      
      // if (captchaError && res.resultCode === ResultCode.CaptchaError) {
      //   setShowCaptcha(true);
        
      //   // выводим ошибку, если ввели каптчу не правильно
      //   setError("captcha", { type: "custom", message: captchaError?.error })
      //   resetField("captcha");
      //   refetch()
      
      // } else {
      //   setError("password", { type: "custom", message: passError })
      // }
      
    } catch (error: any) { }
  };

  return (
    <Grid container justifyContent={"center"}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href="https://social-network.samuraijs.com"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <FormGroup>
            <TextField label="Email" margin="normal" error={!!errors.email} {...register("email")} />
            {errors.email && <span className={styles.errorMessage}>{errors.email.message}</span>}
            
            <TextField type="password" label="Password" margin="normal" error={!!errors.email} {...register("password")} />
            {errors.password && <span className={styles.errorMessage}>{errors.password.message}</span>}

            <FormControlLabel
              label={"Remember me"}
              control={
                <Controller
                  name={"rememberMe"}
                  control={control}
                  render={({ field: { value, ...field } }) => <Checkbox {...field} checked={value} />}
                />
              }
            />
            
            {/* v1 */}
            {/* <Captcha />
            <TextField type="text" label="CAPTCHA" margin="normal" error={!!errors.captcha} {...register("captcha")} />
            {errors.captcha && <span className={styles.errorMessage}>{errors.captcha.message}</span>} */}

            {/* v2 */}
            {/* Отображаем капчу только при необходимости */}
            {showCaptcha && (
              <>
                <Captcha refetch={refetch} />
                <TextField
                  label="Captcha"
                  margin="normal"
                  error={!!errors.captcha}
                  {...register("captcha")}
                />
                {errors.captcha && (
                  <span className={styles.errorMessage}>
                    {errors.captcha.message}
                  </span>
                )}
              </>
            )}
       
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </FormGroup>
        </FormControl>
      </form>
    </Grid>
  )
}
