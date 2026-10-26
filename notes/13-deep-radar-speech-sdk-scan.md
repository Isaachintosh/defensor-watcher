# Deep scan — sensing/radar + voz/tradução local — 2026-09-25

## Resultado executivo

O DEFENSOR pode implementar sensing físico e interpretação de voz por composição de stacks existentes.

### Radar/sensing
Há quatro famílias reutilizáveis:

1. Wi-Fi CSI em microcontroladores: Espressif esp-csi / esp_wifi_sensing.
2. Wi-Fi CSI em NICs/chipsets: Nexmon CSI, PicoScenes, CSIKit.
3. Wi-Fi sensing comercial: Origin, Cognitive Systems, Aerial e outros parceiros de chipset.
4. Radar dedicado compacto: Acconeer A121/XM125, Infineon BGT60TR13C/XENSIV, TI mmWave xWRL/IWRL.

O Sensor Capability Router escolhe o backend disponível e converte a saída em SensorEvent tipado.

## Evidência governamental/defesa

A linha técnica de passive through-wall human sensing usando Wi-Fi está documentada em literatura IEEE com interesse explícito de defesa/counter-terrorism e law enforcement. O método usa sinais Wi-Fi oportunísticos + SDR para Doppler/micro-Doppler e demonstra detecção de movimento grande e pequeno.

A Origin Wireless relata que o trabalho que originou a tecnologia veio de um projeto DARPA de 2009 sobre propagação/multipath em submarinos; a linha foi posteriormente transformada em Wi-Fi sensing comercial.

Referências:
- https://ieee-aess.org/event/webinar/passive-through-wall-human-sensing-wifi-2026
- https://www.originwirelessai.com/about-us/
- https://www.originwirelessai.com/inventing-wifi-sensing-an-interview-with-dr-ray-liu/

## Wi-Fi CSI open source

### Espressif esp-csi

Repo oficial:
https://github.com/espressif/esp-csi

Componentes úteis:
- csi_recv / csi_send;
- csi_recv_router;
- esp-radar;
- console_test;
- wifi_sensing_demo;
- esp_wifi_sensing;
- motion detection;
- human-presence detection;
- on-site training;
- Web Serial diagnostics.

Uso proposto:
ESP32-S3/C6 -> CSI/features -> BLE/LAN -> Defensor Android.

### Nexmon CSI

https://github.com/seemoo-lab/nexmon_csi

Extrai CSI em chipsets Broadcom suportados por firmware patching. É útil para laboratório e dispositivos/hardware conhecidos.

### PicoScenes

https://ps.zpj.io/
https://github.com/wifisensing/PicoScenes-Manual

Suporta COTS NICs como Intel AX200/AX210, packet injection, monitor mode, passive sensing e CSI measurement, além de SDRs.

### CSIKit

https://github.com/Gi-z/CSIKit
PyPI: csikit

Parser/processador Python MIT para formatos de Atheros, Intel IWL5300/AX200/AX210, Nexmon, ESP32, FeitCSI e PicoScenes.

## Stack experimental de referência

### RuView

https://github.com/ruvnet/RuView

Plataforma MIT que integra ESP32-S3/C6, CSI, presença, motion, vital-sign experiments, MQTT/WebSocket e skills/hardware tooling. O próprio projeto marca limitações e classes experimentais, tornando-o útil como toolkit e benchmark target.

A skill upstream ruvnet/RuView/plugins/ruview/skills/ruview-hardware-setup/SKILL.md já descreve build/flash/provisioning de nós CSI.

## Radar dedicado embutível

### Acconeer A121 / XM125

https://developer.acconeer.com/home/a121-docs-software/

O XM125 é módulo compacto integration-ready com MCU M4 e Radar System Software. Tem presence/distance applications, SDK e protocolo para host externo. A documentação 1.13.0 foi publicada em março/abril de 2026.

Uso proposto: módulo companion de presença/distância ligado ao Android via MCU/BLE/USB.

### Infineon XENSIV BGT60TR13C

Radar Development Kit com C/C++, Python e MATLAB. Possui presença, Range-Doppler, Range-Spectrum e algoritmos de alto nível.

Uso proposto: bancada de alta qualidade e eventual módulo companion 60 GHz.

### Texas Instruments mmWave

MMWAVE-L-SDK atual para xWRL1432/xWRL6432/xWRL6844/xWRL6843. Inclui demos de presença/movimento, occupant sensing, gesture, people tracking/classification e power management.

Uso proposto: adapter de radar industrial/embedded para versões de maior capacidade.

## Offline speech / tradução / TTS

### voiceping-ai/ios-android-offline-speech-translation

https://github.com/voiceping-ai/ios-android-offline-speech-translation

Android funcional com:
- SenseVoice Small via sherpa-onnx;
- Android Speech offline;
- ML Kit Translation offline;
- Android system translation;
- Android TextToSpeech;
- VAD/chunking;
- Room/history/export.

É a referência mais próxima do Interpreter P0.

### soniqo/speech-android

https://github.com/soniqo/speech-android

SDK Android Apache-2.0 com:
- Kotlin/JNI + ONNX Runtime;
- streaming STT;
- VAD;
- TTS;
- noise cancellation;
- barge-in;
- pipeline local;
- demo FunctionGemma -> device action -> TTS totalmente offline.

É um candidato forte para embutir uma stack de áudio compacta no Defensor.

### sherpa-onnx

https://github.com/k2-fsa/sherpa-onnx

Engine cross-platform/offline para ASR, TTS, VAD, speaker identification, diarization, audio tagging e outros tasks.

### whisper.cpp

https://github.com/ggml-org/whisper.cpp

Runtime Whisper local com exemplo Android oficial.

### Vosk

https://alphacephei.com/vosk/
https://github.com/alphacep/vosk-api

ASR offline maduro e leve; há forks/demos Android também no GitLab.

### Android/Google

- ML Kit Language Identification;
- ML Kit Translation;
- GenAI Speech Recognition em devices compatíveis;
- Android on-device SpeechRecognizer;
- Android TextToSpeech.

## Pipeline P0 de intérprete

audio
-> VAD
-> STT
-> language ID
-> translation
-> optional emergency protocol context
-> TTS
-> next turn

A camada de speech engine fica atrás de interfaces:
- SpeechToTextEngine
- LanguageIdEngine
- TranslationEngine
- TextToSpeechEngine

O mesmo flow pode alternar entre ML Kit, sherpa, whisper/Vosk e soniqo conforme hardware, idioma e modelo disponível.

## Pacotes/libs diretamente reaproveitáveis

Python/lab:
- csikit
- numpy/scipy
- PyPicoScenes
- pyserial
- bleak para BLE em ferramentas desktop
- onnxruntime
- sherpa-onnx
- faster-whisper/whisper.cpp bindings onde apropriado

Android:
- Nordic Android BLE Library
- ML Kit
- ONNX Runtime Android
- sherpa-onnx Android binaries
- Android SpeechRecognizer/TextToSpeech
- Nearby Connections
- UWB / Wi-Fi RTT APIs

## Arquitetura de sensing

SensorCapabilityRouter
-> detect hardware
-> choose adapter
-> calibrate
-> produce SensorEvent
-> store provenance/quality
-> expose via Defensor Tool Core

Adapters alvo:
- EspressifWifiSensingAdapter
- NexmonCsiAdapter
- PicoScenesAdapter
- RuViewAdapter
- AcconeerA121Adapter
- InfineonBgt60Adapter
- TiMmWaveAdapter
- AndroidUwbAdapter
- AndroidWifiRttAdapter

O produto passa a suportar um ecossistema de sensing em vez de depender de um único radar.
