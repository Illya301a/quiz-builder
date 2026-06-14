import { DeleteIcon } from "@/components/delete-icon";
import { createQuestionOption, type QuestionDraft } from "@/types/quiz-form";
import type { QuestionType } from "@/types/quiz";

interface QuestionEditorProps {
  index: number;
  question: QuestionDraft;
  error?: string;
  canRemove: boolean;
  onChange: (question: QuestionDraft) => void;
  onRemove: () => void;
}

const questionTypes: { value: QuestionType; label: string }[] = [
  { value: "BOOLEAN", label: "True / False" },
  { value: "INPUT", label: "Short answer" },
  { value: "CHECKBOX", label: "Multiple choice" },
];

export function QuestionEditor({
  index,
  question,
  error,
  canRemove,
  onChange,
  onRemove,
}: QuestionEditorProps) {
  function changeType(type: QuestionType) {
    const answer = type === "BOOLEAN" ? true : "";

    onChange({
      ...question,
      type,
      answer,
      options:
        type === "CHECKBOX" && question.options.length < 2
          ? [createQuestionOption(), createQuestionOption()]
          : question.options,
    });
  }

  function updateOption(
    optionId: string,
    updates: Partial<QuestionDraft["options"][number]>,
  ) {
    onChange({
      ...question,
      options: question.options.map((option) =>
        option.id === optionId ? { ...option, ...updates } : option,
      ),
    });
  }

  function removeOption(optionId: string) {
    onChange({
      ...question,
      options: question.options.filter((option) => option.id !== optionId),
    });
  }

  return (
    <section className="question-editor">
      <div className="question-editor__header">
        <h2>Question {index + 1}</h2>
        <button
          className="icon-button"
          type="button"
          aria-label={`Remove question ${index + 1}`}
          title="Remove question"
          disabled={!canRemove}
          onClick={onRemove}
        >
          <DeleteIcon />
        </button>
      </div>

      <div className="question-editor__fields">
        <div className="field">
          <label htmlFor={`question-${question.id}`}>Question text</label>
          <input
            id={`question-${question.id}`}
            value={question.text}
            placeholder="Enter your question"
            onChange={(event) =>
              onChange({ ...question, text: event.target.value })
            }
          />
        </div>

        <div className="field">
          <label htmlFor={`type-${question.id}`}>Answer type</label>
          <select
            id={`type-${question.id}`}
            value={question.type}
            onChange={(event) => changeType(event.target.value as QuestionType)}
          >
            {questionTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="question-editor__answer">
        {question.type === "BOOLEAN" && (
          <fieldset className="field">
            <legend className="field__label">Correct answer</legend>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  checked={question.answer === true}
                  onChange={() => onChange({ ...question, answer: true })}
                />
                True
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name={`answer-${question.id}`}
                  checked={question.answer === false}
                  onChange={() => onChange({ ...question, answer: false })}
                />
                False
              </label>
            </div>
          </fieldset>
        )}

        {question.type === "INPUT" && (
          <div className="field">
            <label htmlFor={`answer-${question.id}`}>Correct answer</label>
            <input
              id={`answer-${question.id}`}
              value={String(question.answer)}
              placeholder="Enter the expected answer"
              onChange={(event) =>
                onChange({ ...question, answer: event.target.value })
              }
            />
          </div>
        )}

        {question.type === "CHECKBOX" && (
          <div className="field">
            <span className="field__label">Answer options</span>
            <div>
              {question.options.map((option, optionIndex) => (
                <div className="choice-row" key={option.id}>
                  <input
                    type="checkbox"
                    checked={option.isCorrect}
                    aria-label={`Mark option ${optionIndex + 1} as correct`}
                    onChange={(event) =>
                      updateOption(option.id, {
                        isCorrect: event.target.checked,
                      })
                    }
                  />
                  <input
                    value={option.text}
                    aria-label={`Option ${optionIndex + 1}`}
                    placeholder={`Option ${optionIndex + 1}`}
                    onChange={(event) =>
                      updateOption(option.id, { text: event.target.value })
                    }
                  />
                  <button
                    className="icon-button"
                    type="button"
                    aria-label={`Remove option ${optionIndex + 1}`}
                    title="Remove option"
                    disabled={question.options.length <= 2}
                    onClick={() => removeOption(option.id)}
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <button
                className="button button--secondary button--compact"
                type="button"
                onClick={() =>
                  onChange({
                    ...question,
                    options: [...question.options, createQuestionOption()],
                  })
                }
              >
                Add option
              </button>
            </div>
          </div>
        )}
      </div>

      {error && <p className="field-error">{error}</p>}
    </section>
  );
}
