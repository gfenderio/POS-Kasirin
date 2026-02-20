'use client';

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShieldCheck,
  Store,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Scan,
  Fingerprint,
  Loader2
} from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post('/api/login', {
        username,
        password
      });

      if (response.status === 200) {
        // Login success
        console.log("Login successful:", response.data);
        // In a real auth system, you'd store the token here.
        // For this rebuild, we just redirect.
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Gagal terhubung ke server. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-transparent text-slate-900 dark:text-slate-100 font-display antialiased selection:bg-primary selection:text-primary-content">
      {/* Left Panel: Visual Showcase */}
      <div
        className="hidden lg:flex lg:w-[60%] relative flex-col justify-end p-12 bg-cover bg-center"
        data-alt="Interior kafe modern dengan mesin espresso dan pencahayaan hangat"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4VWFXXhuR1xBVtgmF5_xZSVQjXefEvcnqS2Js1_X8nxXBGwiKGXXOMsmsi4MZvytRCGnv-tix0ABuQGqqBhykbgKTjQxPUZFSWN8gSHQ0mKfSP6wAr5imE8i24BdfNLrkxa3v5-tvi-eZd0Mh_FWP8CRN8Z_RSLk2NwN9nV-3mJrse6K8-oufe6Z5SluRjDXuocxiWCg1M38u9vqA7Mp5hwq9DEBeBRuDZHuOPSgzqh02z6lequP-cdUWRaHZq4VpNLS4Sw9ePthJ')",
        }}
      >
        {/* Dark Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark/90 via-background-dark/40 to-transparent"></div>
        {/* Content over image */}
        <div className="relative z-10 max-w-lg">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <ShieldCheck className="text-primary h-5 w-5" />
            <span className="text-sm font-medium text-white">
              Sistem Beroperasi
            </span>
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tight text-white drop-shadow-sm mb-4">
            Menggerakkan bisnis Anda, <span className="text-primary">setiap hari.</span>
          </h1>
          <p className="text-lg text-slate-200 font-medium">
            Operasi yang efisien untuk pengecer modern.
          </p>
        </div>
      </div>
      {/* Right Panel: Login Form */}
      <div className="flex w-full lg:w-[40%] flex-col items-center justify-center bg-transparent p-6 sm:p-12 relative">
        {/* Mobile Background Image Overlay (Only visible on small screens) */}
        <div
          className="absolute inset-0 z-0 lg:hidden opacity-10 bg-cover bg-center"
          data-alt="Pola interior kafe modern"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2PoPERNqAB0XSosi9fsgpgqdHExXErDa-PfykEgkQuQLRvDitvz7UbxCwVKD5r1KGPEuBa0Ogb9AAuyC74rUIcGB-wlUIC-ycgHnoIpX8OCr39z7WG98x0MV5bDQaHTzTYSekKeMugUtyuGgp75cFrpKKerNmqejQpUGfWY_liEVoqfg771yg430iHUIl_EmLx0Hu2RGLtPj75UKUqdoad2UmfXFuLX4OshlwYgcktC_Q6O2ebu27CN1EeYt7kA32Ae16HZfmott-')",
          }}
        ></div>
        <div className="w-full max-w-[420px] z-10 flex flex-col h-full justify-between py-4">
          {/* Top Brand Area */}
          <div className="flex items-center gap-3 pt-4 lg:pt-0">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-content">
              <Store className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold tracking-tight dark:text-white">
              POS-Kasirin
            </span>
          </div>
          {/* Main Form Area */}
          <div className="flex flex-col gap-8 my-auto">
            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Selamat Datang Kembali
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Silakan masukkan ID Karyawan dan kata sandi Anda untuk masuk.
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              {/* Employee ID Input */}
              <div className="flex flex-col gap-2">
                <label
                  className="text-sm font-semibold text-slate-700 dark:text-slate-200 ml-1"
                  htmlFor="employee-id"
                >
                  ID Karyawan / Username
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    autoFocus
                    className="form-input block w-full rounded-xl border-0 bg-white dark:bg-[#16211C] py-4 pl-12 pr-4 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-surface-border placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-lg sm:text-base leading-6 transition-all"
                    id="employee-id"
                    placeholder="Masukkan ID Anda"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center ml-1">
                  <label
                    className="text-sm font-semibold text-slate-700 dark:text-slate-200"
                    htmlFor="password"
                  >
                    Kata Sandi
                  </label>
                  <Link
                    className="text-sm font-medium text-primary hover:text-primary-hover transition-colors"
                    href="#"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    className="form-input block w-full rounded-xl border-0 bg-white dark:bg-[#16211C] py-4 pl-12 pr-12 text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-surface-border placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-primary text-lg sm:text-base leading-6 transition-all"
                    id="password"
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {/* Submit Button */}
              <button
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-primary-content shadow-lg shadow-primary/20 hover:bg-primary-hover hover:shadow-primary/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <span>Masuk ke Dasbor</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
            {/* Quick Action / Alternative */}
            <div className="relative">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-200 dark:border-slate-800"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-2 text-sm text-slate-500">
                  Atau masuk dengan
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-[#16211C] px-3 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-surface-border hover:bg-slate-50 dark:hover:bg-surface-border transition-colors"
                type="button"
              >
                <Scan className="h-5 w-5 text-primary" />
                Pindai Kartu
              </button>
              <button
                className="flex items-center justify-center gap-3 rounded-xl bg-white dark:bg-[#16211C] px-3 py-3 text-sm font-semibold text-slate-900 dark:text-white shadow-sm ring-1 ring-inset ring-slate-200 dark:ring-surface-border hover:bg-slate-50 dark:hover:bg-surface-border transition-colors"
                type="button"
              >
                <Fingerprint className="h-5 w-5 text-primary" />
                Biometrik
              </button>
            </div>
          </div>
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 pt-6">
            <p>© 2024 POS-Kasirin Inc.</p>
            <div className="flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500"></span>
              <p>Sistem v2.4.1</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
