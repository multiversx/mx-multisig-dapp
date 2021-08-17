import SVG from 'react-inlinesvg';
import React from 'react';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ReactComponent as BoardMember } from '../../assets/img/clipboard-check.svg';
import { ReactComponent as Proposer } from '../../assets/img/clipboard-list.svg';
import { ReactComponent as Quorum } from '../../assets/img/quorum.svg';
import { ReactComponent as User } from '../../assets/img/user.svg';
import { ReactComponent as Money } from '../../assets/img/money.svg';

export interface StatCardType {
  title?: string;
  value?: string;
  valueUnit?: string;
  svg?: string;
  color?: string;
  percentage?: string;
  tooltipText?: string;
  children?: any;
}

const StatCard = ({
  title = '',
  value = '0',
  valueUnit = '',
  color = '',
  svg = '',
  percentage = '',
  tooltipText = '',
  children = null,
}: StatCardType) => {
  return (
    <div className={`statcard card-bg-grey text-black py-3 px-4 mb-spacer ml-spacer rounded`}>
      <div className="d-flex align-items-center justify-content-between mt-1 mb-2">
        <div className="icon my-1 statcard-item ">
          {svg === 'clipboard-check.svg' ? (
            <BoardMember style={{ width: 32, height: 32 }} />
          ) : svg === 'clipboard-list.svg' ? (
            <Proposer style={{ width: 32, height: 32 }} />
          ) : svg === 'quorum.svg' ? (
            <Quorum style={{ width: 32, height: 32 }} />
          ) : svg === 'user.svg' ? (
            <User style={{ width: 32, height: 32 }} />
          ) : svg === 'money.svg' ? (
            <Money style={{ width: 32, height: 32 }} />
          ) : (
            <SVG src={process.env.PUBLIC_URL + '/' + svg} className="text-black"></SVG>
          )}
        </div>
        <div>{children}</div>
      </div>
      <span className="opacity-6">{title}</span>
      <p className="h5 mb-0">
        {value} {valueUnit}
      </p>
      <small className="opacity-5">
        {percentage}
        {tooltipText !== '' && (
          <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={(props) => (
              <Tooltip id="button-tooltip" {...props}>
                {tooltipText}
              </Tooltip>
            )}
          >
            <FontAwesomeIcon icon={faInfoCircle} className="text-black ml-1" />
          </OverlayTrigger>
        )}
      </small>
    </div>
  );
};

export default StatCard;
