import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function VoiceModule({
  openVoiceModule,
  setOpenVoiceModule,
  setAboutYourself,
  aboutYourself,
}) {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }
  return (
    <div>
      {" "}
      <Transition appear show={openVoiceModule} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => {
            setOpenVoiceModule(false);
          }}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-raleway  text-darkBlue font-bold leading-6 text-gray-900"
                  >
                    Speak about yourself
                  </Dialog.Title>
                  <div className="mt-2 font-raleway">
                    <div className="w-full flex items-center justify-center mt-8">
                      <button
                        className={`${
                          listening && "bg-green-600/[.2]"
                        } px-6 py-2 rounded-full hover:bg-gray/[.2]`}
                        onClick={() => {
                          if (listening) {
                            SpeechRecognition.stopListening();
                          } else {
                            startListening();
                          }
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faMicrophone}
                          className={`${
                            listening ? "text-green-600" : " text-darkBlue"
                          } text-3xl `}
                        />
                      </button>
                    </div>
                    {listening && (
                      <p className="text-gray text-center text-sm">
                        Click the mic to stop transcripting.
                      </p>
                    )}
                    <div>
                      <div className="w-full  bg-lightCream  rounded mt-4 border px-4 py-4  border-[#D2D2D2]">
                        <textarea
                          value={transcript}
                          placeholder="Audio Transcript "
                          className="leading-6 md:leading-8 w-full font-raleway outline-none bg-lightCream rounded  min-h-[40vh] resize-none text-[#3D3929]"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end items-center mt-4 gap-4">
                      {/* <button className="bg-darkBlue  text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out">
                        Replace
                      </button> */}
                      <button
                        onClick={() => {
                          setOpenVoiceModule(false);
                          resetTranscript();
                          SpeechRecognition.stopListening();
                        }}
                        className="bg-gray  text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          setAboutYourself({
                            ...aboutYourself,
                            text: aboutYourself.text + "\n" + transcript,
                          });
                          setOpenVoiceModule(false);
                          resetTranscript();
                          SpeechRecognition.stopListening();
                        }}
                        className="bg-darkBlue  text-white px-6 py-2 rounded hover:bg-opacity-70 duration-150   ease-in-out"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
