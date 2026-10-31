import { useNavigate } from 'react-router-dom';

import arrowLeft from '../../assets/arrow-left.svg';

interface PageHeaderProps {
  title?: string;
  backTo?: string;
}

export const PageHeader = ({ title, backTo }: PageHeaderProps) => {
  const navigate = useNavigate();

  const goBack = () => {
    if (backTo) {
      navigate(backTo);
      return;
    }

    navigate(-1);
  };

  return (
    <header className="page-header">
      <button
        type="button"
        className="page-header__back"
        aria-label="Back"
        onClick={goBack}
      >
        <img src={arrowLeft} alt="" />
      </button>

      {title && <h2 className="page-header__title">{title}</h2>}
    </header>
  );
};