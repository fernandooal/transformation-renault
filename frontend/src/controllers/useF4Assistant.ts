import { useEffect, useRef, useState } from "react";
import * as AssistantService from "../services/assistant.service";
import type { AssistantReport } from "../models/f4Assistant";
import type { FormState } from "../models/f4Form";

/**
 * Reanalisa o formulário enquanto a pessoa digita, com atraso — sem isso cada
 * tecla dispararia uma chamada ao modelo no modo ao vivo.
 */
export function useF4Assistant(form: FormState, totalImpact: number, delay = 600) {
  const [report, setReport] = useState<AssistantReport | null>(null);
  const [thinking, setThinking] = useState(false);
  const seq = useRef(0);
  const first = useRef(true);

  useEffect(() => {
    const mine = ++seq.current;
    setThinking(true);
    const run = () => {
      AssistantService.analyze({ form, totalImpact })
        .then((r) => {
          if (seq.current === mine) setReport(r);
        })
        .finally(() => {
          if (seq.current === mine) setThinking(false);
        });
    };

    // A primeira análise não passa pelo timer: a tela abre com o painel
    // preenchido, em vez de um esqueleto que pisca.
    if (first.current) {
      first.current = false;
      run();
      return;
    }

    const timer = setTimeout(run, delay);
    return () => clearTimeout(timer);
  }, [form, totalImpact, delay]);

  return { report, thinking };
}
