import React from 'react';
import { X, Share, PlusSquare, Download } from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isIOS: boolean;
  onInstallAndroid: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({
  isOpen,
  onClose,
  isIOS,
  onInstallAndroid
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <img src="/harpia-logo.jpg" alt="Harpia" className="h-8 object-contain" />
            <h3 className="font-bold text-slate-800 text-lg">Instalar App Harpia</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X size={20} />
          </button>
        </div>

        <div className="py-4 text-slate-600 text-sm space-y-3">
          <p>
            Tenha a <strong>tabela de preços oficial</strong> direto na tela inicial do seu celular, com acesso rápido mesmo sem sinal de internet na fazenda.
          </p>

          {isIOS ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-900 space-y-2">
              <p className="font-semibold text-xs uppercase tracking-wider text-emerald-700">Passo a passo para iPhone / iPad:</p>
              <ol className="list-decimal list-inside text-sm space-y-1.5">
                <li className="flex items-center gap-2">
                  <span>1. Toque no botão de <strong>Compartilhar</strong></span>
                  <Share size={16} className="text-emerald-700 inline shrink-0" />
                  <span>do Safari (na barra inferior).</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>2. Role para baixo e toque em:</span>
                </li>
                <li className="font-medium bg-white px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-2 text-slate-800">
                  <PlusSquare size={16} className="text-emerald-600" />
                  <strong>Adicionar à Tela de Início</strong>
                </li>
                <li>3. Confirme clicando em <strong>Adicionar</strong> no canto superior direito.</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Toque no botão abaixo para instalar o aplicativo no seu Android:
              </p>
              <button
                onClick={() => {
                  onInstallAndroid();
                  onClose();
                }}
                className="w-full bg-[#006837] hover:bg-[#00522c] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
              >
                <Download size={18} />
                Instalar Aplicativo Agora
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 text-center text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          Agora não
        </button>
      </div>
    </div>
  );
};
