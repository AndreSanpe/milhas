import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface WelcomeProps {
  firstName: string;
  politcsLink?: string;
}

const Welcome = (dataEmail: WelcomeProps) => {
 
  const baseUrl = process.env.DOMAIN_URL ? `https://${process.env.DOMAIN_URL}/` : '';
 
 return (<>

      <Head> 
      
      </Head>
      
      <Html>
        <Preview>Nossas boas-vindas à sua conta PlanMilhas!</Preview>

        <Body style={main}>
          <Container style={container}>

            <Section>
              <Img 
                src={`${baseUrl}/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo_plamilhas.555669ca.png&w=256&q=75`}
                width="180"
                height="35"
                alt='PlanMilhas'
                style={img}
              />
            </Section>

            <div style={line}></div>

            <Text style={title}>Boas-vindas à PlanMilhas!</Text>

            <Text style={subtitle}>{dataEmail.firstName ? `Que bom ver você por aqui, ${dataEmail.firstName}` : 'Que bom ver você por aqui!'} </Text>

            <Text style={textMain}>Agora você tem acesso a ferramenta PlanMilhas e tem uma seleção de recursos exclusivos para gerenciar seus pontos e/ou milhas.</Text>

            <Text style={textMain}>Você pode controlar as contas que administra, calcular custo de milheiro, descobrir se determinada promoção é lucrativa, organizar a quantidade de milhas adquiridas e muito mais...</Text>

            <Text style={textMain}>Comece agora a utilizar estes e outros recursos acessando sua conta.</Text>

            <Section style={buttonSection}>
              <Button href={'https://www.planmilhas.com.br/login'} style={button}>
                <Text style={textButton}>
                  Clique aqui e acesse sua conta
                </Text>
              </Button>
            </Section>

            <Text style={subtitle}>Abraços, <br></br> Equipe PlanMilhas </Text>
        
            <div style={line}></div>
            
            <Section>
              <Text style={footerOne}>
              Este é um e-mail automático disparado pelo sistema. Favor não respondê-lo, pois esta conta não é monitorada. Em caso de dúvidas, acesse o site <Link href='https://www.planmilhas.com.br'><span style={{color: '#26408c'}}><u>www.planmilhas.com.br</u></span></Link>
              </Text>
            </Section>

            <Section>
              <Text style={footer}>
              Copyright © 2023 PlanMilhas. All rights reserved.<br></br>
              Você está recebendo este e-mail porque se cadastrou na PlanMilhas.<br></br>
              PlanMilhas LTDA | CNPJ xx.xxx.xxx/0001-00<br></br>
              Confira nossa <Link href=''><span style={{color: '#26408c'}}><u>Política de privacidade.</u></span></Link><br></br>
              
              </Text>
            </Section>

          </Container>
        </Body>

      </Html>

    </>)
}

export default Welcome;

const main: React.CSSProperties = {
  backgroundColor: '#ffffff',
  color: '#24292e',
  fontFamily: 'sans-serif'
};

const container: React.CSSProperties = {
 width: '560px',
 border: '1px solid #eaeaea',
 textAlign: 'center',
};

const img: React.CSSProperties = {
  margin: 'auto',
  marginTop: '32px',
  marginBottom: '32px'
};

const title: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '20px',
  fontWeight: '800',
  marginTop: '48px'
};

const subtitle: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '16px',
  fontWeight: '600',
  marginTop: '48px'
};

const textMain: React.CSSProperties = {
  textAlign: 'center',
  color: '#374151',
  margin: '20px',
  fontSize: '14px',
};

const buttonSection: React.CSSProperties = {
  textAlign: 'center',
  marginTop: '40px',
  marginBottom: '40px',
  cursor: 'pointer',
};

const button: React.CSSProperties = {
  color: '#fff',
  backgroundColor: '#26408c',
  borderRadius: '0.3em',
  
};

const textButton: React.CSSProperties = {
  fontWeight: '500',
  fontSize: '16px',
  padding: '0px 32px'
};

const line: React.CSSProperties = {
  borderBottom: '1px solid #eaeaea',
  marginLeft: '20px',
  marginRight: '20px'
};

const footerOne: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '11px',
  color: '#9ca3af',
  marginBottom: '20px'
}

const footer: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '11px',
  color: '#9ca3af',
}