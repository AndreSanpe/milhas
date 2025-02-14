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

interface RecoveryProps {
  recoveryLink: string;
  politcsLink?: string;
}

const Recovery = (dataEmail: string) => {
 
  const baseUrl = process.env.DOMAIN_URL ? `https://${process.env.DOMAIN_URL}/` : '';
 
 return (<>

      <Head> 
      
      </Head>
      
      <Html>
        <Preview>Recupere seu acesso na PlanMilhas</Preview>

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

            <Text style={title}>Recupere sua senha</Text>

            <Text style={textMain}>Você solicitou recentemente a redefinição de senha em nosso site. Recupere sua senha agora clicando no botão.*</Text>

            <Section style={buttonSection}>
              <Button href={dataEmail} style={button}>
                <Text style={textButton}>
                  Clique e altere sua senha
                </Text>
              </Button>
            </Section>

            <Section>
              <Text style={linkDois}>Ou <Link href={dataEmail}><span style={linkSpan}><u><b>clique aqui</b></u></span></Link> para alterar</Text>
            </Section>

            <Section>
              <Text style={textObs}><i>*O link gerado expira em <b>1 hora</b>, por isso não deixe de usá-lo o quanto antes.<br></br>** Se você não solicitou a redefinição, acesse sua conta e altere sua senha para sua segurança.</i></Text>
            </Section>

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
              Confira nossa <Link href=''><span style={{color: '#26408c'}}><u>Política de privacidade.</u></span></Link> 
              </Text>
            </Section>

          </Container>
        </Body>

      </Html>

    </>)
}

export default Recovery;

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

const linkDois: React.CSSProperties = {
  textAlign: 'center',
  marginBottom: '48px'
}

const linkSpan: React.CSSProperties = {
  color: '#26408c',
  fontWeight: '600',
  cursor: 'pointer',
}

const textObs: React.CSSProperties = {
  textAlign: 'center',
  fontSize: '11px',
  color: '#4b5563'
}

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