import { onMount, createSignal } from 'solid-js';
import { styled } from 'solid-styled-components';
import { Motion } from 'solid-motionone';
import Fa from 'solid-fa';
import { faUser, faChevronLeft } from "@fortawesome/free-solid-svg-icons";


const HeaderContainer = styled('div')`
    margin-top: 0;
    margin-bottom: 0;
    display: flex;
    justify-content: space-between;
  `;


const Button = styled('button')`
    background: none;
    color: white;
    border: none;
  `;




const Header = (props) => {

    const [showUser, setShowUser] = createSignal(true);

    return (
        <HeaderContainer>
            <div style="flex: 1; text-align: left;">
                {
                    props.showBack && <Button>
                        <Fa icon={faChevronLeft} size="1x" class="icon" />
                    </Button>
                }

            </div>
            <div style="flex: 1; text-align: right;">
                {
                    showUser() && <Button>
                        <Fa icon={faUser} size="1x" class="icon" />
                    </Button>
                }

            </div>
        </HeaderContainer>
    )
}

export default Header