import React, { useEffect, useCallback, useRef, useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { color, typography, spacing } from './shared/styles';
import { jiggle } from './shared/animation';
import { Icon } from './Icon';
import { Link } from './Link';
import WithTooltip from './tooltip/WithTooltip';
import { TooltipMessage } from './tooltip/TooltipMessage';

// prettier-ignore
const Label = styled.label`
  font-weight: ${props => props.appearance !== 'code' && typography.weight.bold};
  font-family: ${props => props.appearance === 'code' && typography.type.code };
  font-size: ${props => props.appearance === 'code' ? typography.size.s1 : typography.size.s2 }px;
`;

// prettier-ignore
const LabelWrapper = styled.div`
  margin-bottom: 0.33em;
  
  ${props => props.hideLabel && css`
    border: 0px !important;
    clip: rect(0 0 0 0) !important;
    -webkit-clip-path: inset(100%) !important;
    clip-path: inset(100%) !important;
    height: 1px !important;
    overflow: hidden !important;
    padding: 0px !important;
    position: absolute !important;
    white-space: nowrap !important;
    width: 1px !important;
  `}
`;

// prettier-ignore
const InputEl = styled.input`
  ::placeholder {
    color: ${color.mediumdark};
    font-weight: ${typography.weight.bold};
  }
  appearance: none;
  border:none;
  box-sizing: border-box;
  display: block;
  outline: none;
  width: 100%;
  margin: 0;

  &[disabled] {
    cursor: not-allowed;
    opacity: .5;
  }

  &:-webkit-autofill { -webkit-box-shadow: 0 0 0 3em ${color.lightest} inset; }
`;

// prettier-ignore
const InputWrapper = styled.div`
  display: inline-block;
  position: relative;
  vertical-align: top;
  width: 100%;

  ${InputEl} {
    background: ${color.lightest};
    border-radius: 4px;
    color: ${color.darkest};
    font-family: ${props => props.appearance === 'code' && typography.type.code };
    font-size: ${props => props.appearance === 'code' ? typography.size.s1 : typography.size.s2 }px;
    line-height: 20px;
    padding: .715em 1em; //40

    &:focus { box-shadow: ${color.primary} 0 0 0 1px inset; }

    ${props => props.appearance === 'secondary' && css`
      box-shadow: ${color.mediumlight} 0 0 0 1px inset;

      &:focus { box-shadow: ${color.secondary} 0 0 0 1px inset; }
    `}

    ${props => props.appearance === 'tertiary' && css`
      padding: 0;
      border: none;
      box-shadow: none;
      background: none;

      &:focus { box-shadow: none !important; }
    `}

    ${props => props.appearance === 'pill' && css`
      font-size: ${typography.size.s1}px;
      line-height: 16px;
      padding: .5em 1em; //28
      border-radius: 3em;
      background: transparent;

      box-shadow: ${color.medium} 0 0 0 1px inset;

      &:focus { box-shadow: ${color.secondary} 0 0 0 1px inset; }
    `}

    ${props => props.appearance === 'code' && css`
      font-size: ${typography.size.s2 -1 }px;
      line-height: 16px;
      font-family: ${typography.type.code};
      border-radius: 2px;
      background: rgba(0,0,0,.05);
      padding: 3px 6px;

      &:focus { box-shadow: ${color.secondary} 0 0 0 1px inset; }
    `}
  }

  ${props => props.startingType === 'password' && css`
    ${InputEl} {
      padding-right: 3.8em;
    }
  `}

  ${props => props.icon && css`
    > svg {
      transition: all 150ms ease-out;
      position: absolute;
      top: 50%;
      height: 0.75em;
      width: 0.75em;
  		font-size: ${props.appearance === 'pill' ? 0.75 : 1 }em;
      margin-top: -.375em;
  		z-index: 1;

      background: transparent;

      path {
        transition: all 150ms ease-out;
        fill: ${color.mediumdark};
      }
    }

    ${InputEl}:focus + svg path {
      fill: ${color.darker};
    }

    ${InputEl} {
      padding-left: 2.45em;

      ${props.appearance === 'pill' && css` padding-left: 2.4em; `};
      ${props.appearance === 'tertiary' && css` padding-left: 1.75em; `};
    }
    > svg { left: ${props.appearance === 'tertiary' ? 0 : 0.8 }em; }

  `}

  ${props => props.error && css`
    ${props.appearance !== 'tertiary' && css`
      ${InputEl} {
          box-shadow: ${color.negative} 0 0 0 1px inset;
          &:focus { box-shadow: ${color.negative} 0 0 0 1px inset !important;  }
      }
    `};

    svg {
      animation: ${jiggle} 700ms ease-out;
      path { fill: ${color.negative}; }
    }
  `}
`;
// prettier-ignore
const InputContainer = styled.div`
  ${props => props.orientation === 'horizontal' && css`
    display: table-row;

    ${LabelWrapper}, ${InputWrapper} {
      display: table-cell;
    }

    ${LabelWrapper} {
      width: 1px;
      padding-right: 20px;
      vertical-align: middle;
    }

    ${InputWrapper} {
      width: auto;
    }

  `}
`;

const ErrorTooltip = styled(WithTooltip)`
  width: 100%;
`;

const ErrorTooltipMessage = styled(TooltipMessage)`
  width: 170px;
`;

const Action = styled.div`
  position: absolute;
  right: 0;
  min-width: 45px;
  top: 50%;
  transform: translateY(-50%);
  font-weight: bold;
  font-size: 11px;
`;

export const PureInput = forwardRef(
  (
    {
      id,
      value,
      label,
      hideLabel,
      orientation,
      icon,
      error,
      appearance,
      className,
      lastErrorValue,
      startingType,
      type,
      onActionClick,
      suppressErrorMessage,
      ...props
    },
    ref
  ) => {
    const errorId = `${id}-error`;
    let errorMessage = typeof error === 'function' ? error(value) : error;
    if (lastErrorValue) {
      if (value !== lastErrorValue) {
        errorMessage = null;
      }
    }

    const inputEl = (
      <InputEl
        id={id}
        // Pass the ref to the actual input element so it can be controlled
        // externally.
        ref={ref}
        value={value}
        type={type}
        aria-describedby={errorId}
        aria-invalid={!!error}
        {...props}
      />
    );

    return (
      <InputContainer orientation={orientation} className={className}>
        <LabelWrapper hideLabel={hideLabel}>
          <Label htmlFor={id} appearance={appearance}>
            {label}
          </Label>
        </LabelWrapper>

        <InputWrapper
          error={errorMessage}
          data-error={error}
          icon={icon}
          appearance={appearance}
          startingType={startingType}
        >
          {icon && <Icon icon={icon} aria-hidden />}
          <ErrorTooltip
            placement="right"
            trigger="none"
            startOpen
            tagName="div"
            hasChrome={!!errorMessage && !suppressErrorMessage}
            tooltip={
              errorMessage && !suppressErrorMessage && <ErrorTooltipMessage desc={errorMessage} />
            }
          >
            {inputEl}
          </ErrorTooltip>

          {startingType === 'password' && (
            <Action>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <Link isButton tertiary onClick={onActionClick}>
                {type === 'password' ? 'Show' : 'Hide'}
              </Link>
            </Action>
          )}
        </InputWrapper>
      </InputContainer>
    );
  }
);

PureInput.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  appearance: PropTypes.oneOf(['default', 'secondary', 'tertiary', 'pill', 'code']),
  label: PropTypes.string.isRequired,
  hideLabel: PropTypes.bool,
  orientation: PropTypes.oneOf(['vertical', 'horizontal']),
  icon: PropTypes.string,
  error: PropTypes.node,
  suppressErrorMessage: PropTypes.bool,
  className: PropTypes.string,
  lastErrorValue: PropTypes.string,
  startingType: PropTypes.string,
  type: PropTypes.string,
  onActionClick: PropTypes.func,
};

PureInput.defaultProps = {
  value: '',
  appearance: 'default',
  hideLabel: false,
  orientation: 'vertical',
  icon: null,
  error: null,
  suppressErrorMessage: false,
  className: null,
  lastErrorValue: null,
  startingType: 'text',
  type: 'text',
  onActionClick: null,
};

export const Input = forwardRef(({ type: startingType, startFocused, ...rest }, ref) => {
  const [type, setType] = useState(startingType);
  const togglePasswordType = useCallback(
    (event) => {
      // Make sure this does not submit a form
      event.preventDefault();
      if (type === 'password') {
        setType('text');
        return;
      }
      setType('password');
    },
    [type, setType]
  );
  // Outside refs take precedence
  const inputRef = ref || useRef();
  const didFocusOnStart = useRef(false);
  useEffect(() => {
    if (inputRef && inputRef.current && startFocused && !didFocusOnStart.current) {
      inputRef.current.focus();
      didFocusOnStart.current = true;
    }
  }, [inputRef, inputRef.current, didFocusOnStart, didFocusOnStart.current]);

  return (
    <PureInput
      ref={inputRef}
      startingType={startingType}
      type={type}
      onActionClick={togglePasswordType}
      {...rest}
    />
  );
});

Input.propTypes = {
  startFocused: PropTypes.bool,
  type: PropTypes.string,
};

Input.defaultProps = {
  startFocused: false,
  type: 'text',
};
